import {action, computed, makeObservable, observable} from "mobx"
import combineQuery from "graphql-combine-query"

import {services} from "~services";
import {DocumentNode} from "graphql/language/ast";
import {app} from "~modules/info";
import {platform} from "@core/main/lib/platform";
import * as Network from 'expo-network';
import * as DeviceInfo from "expo-device"
import AppConfig from "@core/main/config";
import CommonStore from "@core/main/lib/store/common";
import {classComputedPropsCache} from "@core/main/lib/mobx/class-computed-props-cache";
import {AppState, AppStateStatus, NativeEventSubscription} from "react-native";
import {logComputed} from "@core/main/lib/mobx/log-computed";
import {ClientEmit} from "~gql/api";
import {TActionMain} from "@core/main/types";
import toArray from "@core/main/util/base/toArray";

export class MainStore extends CommonStore {
    gql = services.graphql

    @observable
    currentUtcTime: any = {
        year: null,
        month: null,
        minute: null,
        hour: null,
        day: null,

        dayFull: null,
        hourFull: null,
        minuteFull: null,
    }

    @observable
    scopesFetched: any = {}

    scopes: any = {}

    @observable
    bottomInformer: {
        visible: boolean,
        content: any,
    } = {visible: false, content: null}

    @observable
    appState: AppStateStatus = 'unknown'
    appStateChangeSubscription?: NativeEventSubscription


    constructor() {
        super()
        makeObservable(this)
    }

    boot() {
        this.stores().menu.registerActionChannel('main', this.runAction.bind(this))
    }

    @action
    async runAction(action: TActionMain) {
        const {payload, params} = action
        switch (action.type) {
            case "scopesFetch":
                this.scopesFetch(toArray(payload))
        }
    }

    init() {
        this.onIntervalMinute()
        setInterval(() => this.onIntervalMinute(), 1000 * 60)

        this.disposers = classComputedPropsCache(this, [])
        this.appState = AppState.currentState

        this.appStateChangeSubscription = AppState.addEventListener('change', nextAppState => {
            if (
                this.appState.match(/inactive|background/) &&
                nextAppState === 'active'
            ) {
                console.log('App has come to the foreground!')
                this.bus().emitter.emit('bus:app.foreground')
            }
            this.appState = nextAppState;
        })

        this.bus().on('websocket:emit', this.onWebsocketEmit.bind(this))
    }

    @action
    onWebsocketEmit(event: ClientEmit) {
        this.bus().emit('socket:emit:' + event.eventName, event)
    }

    @action
    onIntervalMinute() {
        const date = new Date()
        this.currentUtcTime.year = date.getUTCFullYear()
        this.currentUtcTime.month = date.getUTCMonth()
        this.currentUtcTime.day = date.getUTCDate()
        this.currentUtcTime.hour = date.getUTCHours()
        this.currentUtcTime.minute = date.getUTCMinutes()
        this.currentUtcTime.dayFull = [this.currentUtcTime.year, this.currentUtcTime.month, this.currentUtcTime.day].join('.')
        this.currentUtcTime.hourFull = [this.currentUtcTime.year, this.currentUtcTime.month, this.currentUtcTime.day, this.currentUtcTime.hour].join('.')
        this.currentUtcTime.minuteFull = [this.currentUtcTime.year, this.currentUtcTime.month, this.currentUtcTime.day, this.currentUtcTime.hour, this.currentUtcTime.minute].join('.')
    }

    scopeRegister(scope: string, queries: DocumentNode[]) {
        if (!this.scopes[scope]) {
            this.scopes[scope] = []
        }
        Array.prototype.push.apply(this.scopes[scope], queries)
    }

    @action
    async scopesFetch(scopes: any, refetch?: boolean) {
        return await this.createScopesFetchPromise(scopes, false);
    }

    createScopesFetchPromise(scopes: string[], refetch?: boolean) {

        const debug = this.stores().debug

        debug.info('Scopes fetch', {scopes, refetch}, {scope: 'request'})

        return new Promise(async (resolve, reject) => {

            const scopesData = scopes
                .filter(scope => {
                    return refetch || !this.scopesFetched[scope]
                })
                .map(scope => {

                    let query: any = combineQuery('res');

                    query = app.scopeQuery(query, scope)

                    /*
                    try {
                        for (const scopeQuery of this.scopes[scope]) {
                            query = query.add(scopeQuery)
                        }
                    } catch (e) {
                        console.log(e)
                    }
                    */

                    return {
                        scope: scope,
                        query: query.document ? query : null
                    }
                })
                .filter(info => !!info.query)


            const promises = scopesData.map(info => {

                const scopeName = info.scope
                const scopeQuery = info.query

                return new Promise(async (resolve, reject) => {

                    const {document, variables} = scopeQuery

                    try {
                        let res = await this.gql.client.query({
                            query: document,
                            fetchPolicy: 'no-cache',
                            variables: {
                                skipBatchErrors: 1
                            },
                        })
                        resolve(res.data);
                    } catch (error: any) {

                        const isCritical = !!(error.message.match('Parse error') || error.message.match('Network request failed'))

                        debug.error('Scope query error', {
                            scopeName,
                            error,
                            isCritical
                        }, {scope: 'request'})

                        if (isCritical) {
                            reject(error)
                        } else {
                            resolve(false)
                        }
                    }
                })
            })

            const allResult: any = {}

            if (promises.length) {

                let results: any
                const resultsByModule: any = {};

                try {
                    results = await Promise.all(promises)
                    debug.info('Scopes query resolved', {scopes, refetch}, {scope: 'request'})
                } catch (error: any) {
                    debug.error('Scopes query error', {
                        scopes,
                        refetch,
                        error
                    }, {scope: 'request'})
                    reject(error)
                    return
                }

                scopesData.forEach((info, index) => {

                    const scope = info.scope

                    const scopeResult = results[index]

                    if (scopeResult) {

                        for (let key in scopeResult) {

                            let [module, opType, opName, varName] = key.split('__')

                            if (!opName) {
                                varName = opType
                                opType = 'commit'
                                opName = 'SCOPE_' + scope.toUpperCase()
                            } else if (!varName) {
                                varName = opType
                                opType = 'commit'
                            }

                            const result = scopeResult[key]

                            allResult[key] = result

                            if (!resultsByModule[module])
                                resultsByModule[module] = {}

                            if (!resultsByModule[module][opType])
                                resultsByModule[module][opType] = {}

                            if (!resultsByModule[module][opType][opName])
                                resultsByModule[module][opType][opName] = {}

                            resultsByModule[module][opType][opName][varName] = result
                        }
                    }
                })

                for (let module in resultsByModule) {
                    for (let opType in resultsByModule[module]) {
                        for (let opName in resultsByModule[module][opType]) {
                            const store = require('~stores').stores[module]
                            if (store) {
                                if (store[opName]) {
                                    store[opName](resultsByModule[module][opType][opName])
                                } else {
                                    console.warn('scope store method not exist', module + '.' + opName)
                                }
                            } else {
                                console.warn('scope store not exist', module)
                            }
                        }
                    }
                }

                scopesData.forEach((info, index) => {
                    this.bus().emit('scope:fetched', info.scope)
                    //this.scopesFetched[info.scope] = true
                })
            }

            resolve(allResult)
        })
    }

    async checkNeedUpdate() {
        return AppConfig.APP_NEED_UPDATE
    }

    clientContextGlobal: any = {}

    async loadClientContextGlobal() {
        this.clientContextGlobal = {
            ...this.clientContextGlobal,
            ip: await Network.getIpAddressAsync(),
            networkState: await Network.getNetworkStateAsync()
        }
        return this.clientContextGlobal
    }

    @computed
    get httpClientContext() {
        logComputed(this, 'httpClientContext')
        const context = {
            buildVersion: platform.getNativeBuildVersion(),
            appVersion: platform.getNativeApplicationVersion(),
            platform: platform.getCode(),
            currentUtcTime: this.currentUtcTime,
            device: {
                brand: DeviceInfo.brand,
                osName: DeviceInfo.osName,
                osVersion: DeviceInfo.osVersion,
                deviceName: DeviceInfo.deviceName
            },
        }

        const hashContext = {
            buildVersion: context.buildVersion,
            appVersion: context.appVersion,
            platform: context.platform,
            device: context.device,
        }

        const hashContextDay = {
            ...hashContext,
            day: this.currentUtcTime.dayFull
        }

        const hashContextHour = {
            ...hashContext,
            hour: this.currentUtcTime.hourFull
        }

        return {
            ...context,
            ...this.clientContextGlobal,
            hourHash: services.crypto.encrypt(JSON.stringify(hashContextHour)),
            dayHash: services.crypto.encrypt(JSON.stringify(hashContextDay)),
        }
    }

    @action
    showBottomInformer(content: any) {
        this.bottomInformer.visible = true
        this.bottomInformer.content = content
    }

    @action
    hideBottomInformer() {
        this.bottomInformer.visible = false
    }


}

export default MainStore

import {action, computed, makeObservable, observable} from "mobx";
import {makePersistable} from "mobx-persist-store";
import CommonStore from "@core/main/lib/store/common";
import {
    TDebugDeliveryChannelType,
    TDebugDeliveryChannelTypeInfo,
    TDebugEvent,
    TDebugEventScopeInfo,
    TDebugEventTypeInfo,
    TDevConsolePanelItem
} from "@core/main/types";
import {deepGet, deepSet, randID} from "@core/main/util/base";
import formatJsonLogData from "@core/main/util/base/formatJsonLogData";
import {Record} from "immutable";
import toArray from "@core/main/util/base/toArray";
import {DebugEvent} from "@core/main/model/DebugEvent";
import debounce from "@core/main/util/base/debounce";
import {AppClientDebugParams} from "~gql/api";


export class DebugStore extends CommonStore {

    serverEventsQueue: DebugEvent[] = []
    eventHistory: DebugEvent[] = []
    reportAccessCode = 'a23451'

    @observable
    reportAccess: boolean = false

    @observable
    devMode: boolean = false

    @observable
    adminMode: boolean = false

    @observable
    showBubble: boolean = false

    @observable
    consoleLogEnable: boolean = false

    @observable
    consoleLogOverlay: boolean = false

    @observable
    consolePanelFullscreen: boolean = false


    @observable
    devAccessModal: {
        visible: boolean
    } = {visible: false}

    @observable
    devModal: {
        visible: boolean
    } = {visible: false}

    @observable
    initialRoute: string | null = null

    @observable
    consoleItemsVersion: number = 0

    eventsTransportConfig = {}
    consolePanelItems: TDevConsolePanelItem[] = []

    @observable
    newNoticeId: number = 30000000

    constructor() {
        super()
        makeObservable(this)
        makePersistable(this, {
            name: DebugStore.name,
            properties: [
                'initialRoute',
                'devMode',
                'adminMode',
                'showBubble',
                'consoleLogOverlay',
                // 'eventsTransportConfig',
                'newNoticeId'
            ],
        })
    }

    saveParamsToServerDebounced: any

    boot() {
        setInterval(() => this.consolePanelClear(), 1000 * 60 * 60)
        this.saveParamsToServerDebounced = debounce(this.saveParamsToServer, 5000)
    }

    saveParamsToServer() {
        const appClient = this.stores().user.appClient
        if (appClient) {
            appClient.setDebugParam('eventsTransport', this.eventsTransportConfig)
            this.stores().user.apiMutateAppClient()
        }
    }

    @action
    setClientDebugParams(params: AppClientDebugParams) {
        if (params.eventsTransport)
            this.eventsTransportConfig = params.eventsTransport
    }

    @action
    incNewNoticeId() {
        this.newNoticeId++
        return this.newNoticeId
    }

    @action
    setEventsTransportConfigItem(path: string[], val: boolean) {
        deepSet(this.eventsTransportConfig, path, val)
        this.saveParamsToServerDebounced()
    }

    @action
    devModeToggle() {
        this.devMode = !this.devMode
    }

    @action
    consolePanelFullscreenToggle() {
        this.consolePanelFullscreen = !this.consolePanelFullscreen
    }


    @action
    adminModeToggle() {
        this.adminMode = !this.adminMode
    }

    @action
    showBubbleToggle() {
        this.showBubble = !this.showBubble
    }

    @action
    consoleLogEnableToggle() {
        this.consoleLogEnable = !this.consoleLogEnable
    }

    @action
    consoleLogOverlayToggle() {
        this.consoleLogOverlay = !this.consoleLogOverlay
    }

    @action
    devModeDisable() {
        this.devMode = false
        this.adminMode = false
        this.showBubble = false
    }

    @action
    devModeEnable() {
        this.devMode = true
        this.adminMode = true
        this.showBubble = true
    }

    @action
    deliveryToPanel(event: DebugEvent) {
        const item: TDevConsolePanelItem = {
            uid: randID(),
            event,
            dataFormatted: event.data ? formatJsonLogData(event.data) : null
        }
        this.consolePanelItems.push(item)
        this.consoleItemsVersion++
    }

    @action
    consolePanelClear() {
        this.consolePanelItems = []
        this.consoleItemsVersion++
    }

    @action
    consolePanelItemsRead(itemsUid: string[]) {
        if (itemsUid.length)
            this.consolePanelItems.filter((item) => itemsUid.indexOf(item.uid) > -1).forEach(item => {
                item.readed = true
            })
    }

    @action
    showAccessModal() {
        this.devAccessModal.visible = true
    }

    @action
    hideAccessModal() {
        this.devAccessModal.visible = false
    }

    @action
    showDevModal() {
        this.devModal.visible = true
    }

    @action
    hideDevModal() {
        this.devModal.visible = false
    }

    @action
    setInitialRoute(value: string | null) {
        this.initialRoute = value
    }

    @computed
    get consoleStat() {
        const a = this.consoleItemsVersion

        return this.consolePanelItems.reduce<{
            countByType: Record<string, number>
            scopes: Record<string, {
                count: number,
                countByType: Record<string, number>
            }>,
        }>((map, item) => {

            const {event} = item

            toArray(item.event.scope).forEach((channel) => {
                if (!map.scopes[channel])
                    map.scopes[channel] = {
                        count: 0,
                        countByType: {}
                    }

                map.scopes[channel].count++

                if (!map.scopes[channel].countByType[event.type])
                    map.scopes[channel].countByType[event.type] = 0

                map.scopes[channel].countByType[event.type]++
            })

            if (!map.countByType[event.type])
                map.countByType[event.type] = 0

            map.countByType[event.type]++

            return map
        }, {
            scopes: {},
            countByType: {}
        })
    }

    createEvent(data: Partial<TDebugEvent> = {}) {
        return new DebugEvent(data)
    }

    info(message: string, data?: any, event: Partial<TDebugEvent> = {}) {
        this.pushEvent({
            type: 'info',
            message,
            ...{...{data}, ...event}
        })
    }

    error(message: string, data?: any, event?: Partial<TDebugEvent>) {
        this.pushEvent({
            type: 'error',
            message,
            ...{...{data}, ...event}
        })
    }

    warn(message: string, data?: any, event?: Partial<TDebugEvent>) {
        this.pushEvent({
            type: 'warning',
            message,
            ...{...{data}, ...event}
        })
    }

    dump(message: string, data?: any, event: Partial<TDebugEvent> = {}) {

        this.pushEvent({
            type: 'info',
            message,
            ...{
                ...{data},
                ...event,
                scope: 'dump'
            }
        } as TDebugEvent)
    }

    runtimeError(message: string, data?: any, event?: Partial<TDebugEvent>) {
        this.pushEvent({
            type: 'error',
            message,
            ...{...{data}, ...event}
        }, true)
    }

    async pushEvent(eventData: TDebugEvent | DebugEvent, commit = false) {

        const event = eventData instanceof DebugEvent ? eventData : new DebugEvent(eventData)

        event.finish()

        event.session = this.sessionData

        const eventScopes = toArray(event.scope)

        let channels: Partial<Record<TDebugDeliveryChannelType, boolean>> = {}

        this.deliveryChannels.forEach(({name: channel}) => {
            if (deepGet(this.eventsTransportConfig, [channel, 'all', event.type])) {
                channels[channel] = true
            } else {
                eventScopes.forEach((scope) => {
                    if (deepGet(this.eventsTransportConfig, [channel, event.scope, event.type]))
                        channels[channel] = true
                })
            }
        })

        const channelNames = Object.keys(channels) as TDebugDeliveryChannelType[]

        this.deliveryToHistory(event)

        channelNames.forEach(channel => {
            switch (channel) {
                case 'panel':
                    this.deliveryToPanel(event)
                    break
                case 'server':
                    this.deliveryToServer(event)
                    break
                case 'console':
                    this.deliveryToConsole(event)
                    break
            }
        })

    }

    deliveryToServer(event: DebugEvent, commit = false) {
        this.serverEventsQueue.push(event)
        if (commit) {
            this.deliverToServerCommit()
        } else {
            setTimeout(() => this.deliverToServerCommit(), 500)
        }
    }

    async deliverToServerCommit() {
        if (this.serverEventsQueue.length) {
            const eventsQueue = this.serverEventsQueue
            this.serverEventsQueue = []
            this.services().websocket.sendMessage({
                event: 'frontend:events',
                data: eventsQueue.map(event => event.getServerData())
            })
        }
    }

    deliveryToConsole(event: DebugEvent) {

        const consoleArgs = [event.message]

        if (event.data)
            consoleArgs.push(event.data)

        switch (event.type) {
            case 'info':
                console.info.apply(null, consoleArgs)
                break
            case 'warning':
                console.warn.apply(null, consoleArgs)
                break
            case 'error':
                console.error.apply(null, consoleArgs)
                break
            case 'fatal':
                console.error.apply(null, consoleArgs)
                break
        }
    }

    deliveryToHistory(event: DebugEvent) {
        this.eventHistory.push(event.getEventHistoryModel())
    }

    @computed
    get deliveryChannels(): TDebugDeliveryChannelTypeInfo[] {
        return [
            {name: 'console'},
            {name: 'panel'},
            {name: 'server'},
            {name: 'history'},
        ]
    }

    @computed({keepAlive: true})
    get eventTypes(): TDebugEventTypeInfo[] {
        return [
            {name: 'info'},
            {name: 'warning'},
            {name: 'error'},
        ]
    }

    @computed({keepAlive: true})
    get eventScopes(): TDebugEventScopeInfo[] {
        return [
            {name: 'boot'},
            {name: 'design'},
            {name: 'router'},
            {name: 'request'},
            {name: 'render'},
            {name: 'store'},
            {name: 'dump'},
            {name: 'websocket'},
        ]
    }

    get sessionData() {
        const userStore = this.stores().user
        const vorderStore = this.stores().vorder

        const clientId = userStore.clientId
        const sessionId = userStore.sessionId
        const userId = userStore.userId

        const phone = userStore.getPhone()
        const vorderId = vorderStore.vorderId

        return {
            clientId,
            sessionId,
            userId,
            vorderId,
            phone
        }
    }

    renderCounter: Record<string, number> = {}

    renderCount(name: string) {
        if (!this.renderCounter[name])
            this.renderCounter[name] = 0
        this.renderCounter[name]++
    }

    getDebugReportJson() {
        return JSON.stringify(this.getDebugReport())
    }

    getDebugReport() {
        const data = {
            user: this.stores().user.getSessionData(),
            events: this.eventHistory
        }
        return data
    }

    clipboardDebugReport() {

    }

    sendDebugReport() {

    }

    @action
    grantReportAccess(code?: string) {
        if (code && this.reportAccessCode === code) {
            this.reportAccess = true;
        }
        return this.reportAccess
    }
}

export default DebugStore

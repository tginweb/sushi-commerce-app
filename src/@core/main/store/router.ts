import {action, computed, makeObservable, observable} from "mobx"
import {
    Href,
    TActionDialog,
    TActionRouter,
    TActionSite,
    TActionTelegram,
    TComponentRenderInfo,
    TMaybe,
    TRouteState
} from "@core/main/types";
import AppConfig from "@core/main/config";
import CommonStore from "@core/main/lib/store/common";
import {busService} from "@core/main/service/bus";
import {logComputed} from "@core/main/lib/mobx/log-computed";
import urlParse from "@core/main/util/base/urlParse";
import * as Linking from "expo-linking";
import {app} from "~modules/info";
import rtrim from "locutus/php/strings/rtrim";
import ltrim from "locutus/php/strings/ltrim";
import {cryptoService} from "@core/main/service/crypto";
import urlBuild from "@core/main/util/base/urlBuild";
import * as Device from "expo-device";
import parseUrl from "parse-url";


export class RouterStore extends CommonStore {

    @observable
    loginScreenShown: boolean = false

    @observable
    isFrontLoaded: boolean = false

    @observable
    currentRoute: TRouteState = {
        pathname: '',
        params: {},
        canGoBack: true
    }

    @observable
    goBackProcess: boolean = false

    @observable
    additionalParams: Record<string, any> = {}

    constructor() {
        super()
        makeObservable(this)
    }

    boot() {
        this.stores().menu.registerActionChannel('router', this.runActionRouter.bind(this))
        this.stores().menu.registerActionChannel('site', this.runActionSite.bind(this))
        this.stores().menu.registerActionChannel('tg', this.runTelegram.bind(this))
        this.stores().menu.registerActionChannel('dialog', this.runActionDialog.bind(this))
    }

    @action
    async runTelegram(action: TActionTelegram) {

        if (!action.url)
            return;

        if (!Device.isDevice) {
            this.services().websocket.sendMessage({
                name: 'dev.browserOpenUrl',
                data: {
                    url: action.url
                }
            })
        } else {
            Linking.openURL(action.url)
        }
    }

    @action
    async runActionSite(action: TActionSite) {
        Linking.openURL(this.makeSiteUrl(action.pathFull || '', null, action.params?.addSession))
    }

    @action
    async runActionDialog(action: TActionDialog) {
        console.log('runActionDialog', action)
        switch (action.type) {
            default:
            case "nav":
                const modals = app.getModals() as TComponentRenderInfo[]
                const modal = modals.find(modal => modal.name === action.path)
                if (modal && modal.open) {
                    modal.open({stores: this.stores()})
                }
        }
    }

    @action
    async runActionRouter(action: TActionRouter) {
        switch (action.type) {
            case 'nav':
            default: {
                let routePath = '/' + ltrim(action.pathFull, '/')
                this.nav(routePath, action.params?.replace, action.params?.addBacklink)
                break
            }
        }
    }

    @action
    setLoginScreenShown(state: boolean) {
        this.loginScreenShown = state
    }

    parseRouterUrl(url: string) {

        let urlNormalized = ''

        const routerRegexp = new RegExp(/router\:\/\//)

        if (url.match(routerRegexp)) {
            urlNormalized = url.replace(routerRegexp, '')
        } else if (url.charAt(0) === '/') {
            urlNormalized = url.substring(1);
        } else {
            urlNormalized = url
        }

        urlNormalized = 'router://site.com/' + urlNormalized

        return parseUrl(urlNormalized)
    }

    inCurrentRoute(needle: Href) {

        console.log('needle', needle)

        let needleHref: Href | null = null

        if (typeof needle === 'string') {
            const parsed = this.parseRouterUrl(needle)
            console.log('parsed', parsed)
            needleHref = {
                pathname: parsed.pathname,
                params: parsed.query
            }
        } else if (typeof needle === "object") {
            needleHref = {
                params: {},
                ...needle
            }
        }

        console.log('needleHref', needleHref)
        console.log('this.currentRoute.pathname !== needleHref?.pathname', this.currentRoute.pathname, needleHref?.pathname)

        if (!needleHref || (this.currentRoute.pathname !== needleHref.pathname)) {
            return false
        }

        for (const [paramName, paramValue] of Object.entries(needleHref.params)) {
            console.log('param', paramName, [paramValue, this.currentRoute.params[paramName]])
            if (this.currentRoute.params[paramName] !== paramValue) {
                return false
            }
        }

        return true
    }

    routeToString(route: Href) {
        if (typeof route === 'string') {
            return route
        } else if (typeof route === 'object') {
            return route.pathname + (Object.keys(route.params).length ? '?' + new URLSearchParams(route.params).toString() : '')
        } else {
            return ''
        }
    }

    routesEqual(route1: Href, route2: Href) {
        return this.routeToString(route1) === this.routeToString(route2)
    }

    push(path: Href, addBacklink: boolean = false) {
        this.nav(path, false, addBacklink)
    }

    replace(path: Href, addBacklink: boolean = false) {
        this.nav(path, true, addBacklink)
    }

    setParams(params: any) {
        busService.emit('bus:router.setParams', params)
    }

    back() {
        busService.emit('bus:router.back')
    }

    dismiss(count?: number) {
        busService.emit('bus:router.dismiss', count)
    }

    dismissAll() {
        busService.emit('bus:router.dismissAll')
    }

    nav(path: Href, replace: boolean = false, addBacklink: boolean = false) {

        const url = this.routeToString(path)

        if (
            url.match(/order/)
            && this.routesEqual(path, this.currentRoute)
        ) return;

        let _path: Href & {
            params: Record<string, any>
        }

        if (typeof path === 'string') {
            const pathParsed = urlParse(path)
            _path = {
                pathname: pathParsed.pathname,
                params: pathParsed.query
            }
        } else {
            _path = {
                params: {},
                ...path
            }
        }

        if (addBacklink) {
            _path.params.backlink = this.currentRoute.pathname
        }

        console.log('Router.nav', _path)

        if (replace) {
            busService.emitter.emit('bus:router.replace', _path)
        } else {
            busService.emitter.emit('bus:router.push', _path)
        }
    }

    @action
    setCurrentRoutePath(state: TRouteState) {
        if (!this.routesEqual(state, this.currentRoute) || state.canGoBack !== this.currentRoute.canGoBack) {
            this.currentRoute = {
                ...state
            }
        }
    }

    @action
    setIsFrontLoaded() {
        if (!this.isFrontLoaded)
            this.isFrontLoaded = true
    }

    @action
    onGoBackBefore() {
        this.goBackProcess = true
    }

    @action
    onGoBackAfter() {
        this.goBackProcess = false
    }

    @computed
    get isFrontPage() {
        logComputed(this, 'isFront')
        return this.currentRoute.pathname === AppConfig.APP_FRONT_PAGE
    }

    getCurrentPath(pathFromHook?: string) {
        if (pathFromHook && pathFromHook !== '/') {
            return pathFromHook
        } else {
            return this.currentRoute.pathname
        }
    }

    @action
    setAdditionalParam(name: string, value: any) {
        this.additionalParams[name] = value
    }

    getAdditionalParam(name: string) {
        return this.additionalParams[name]
    }

    alertsQueue: (() => void)[] = []

    @action
    alertsQueueClear() {
        this.alertsQueue = []
    }

    @action
    alertsQueueAdd(cb: TMaybe<() => void>) {
        cb && this.alertsQueue.push(cb)
    }

    @action
    alertsQueueShow() {
        const nextAlert = this.alertsQueue.shift()
        if (nextAlert)
            nextAlert()
    }

    makeSiteUrl(url: string, query?: any, addSession?: boolean) {
        const _url = url ? rtrim(AppConfig.APP_SITE_URL, '/') + '/' + ltrim(url, '/') : AppConfig.APP_SITE_URL
        const _query = query ? {...query} : {}
        const urlObj = urlParse(_url)
        if (addSession)
            _query._sess = cryptoService.encodeData(this.stores().user.getExternalSessionParams())
        _query.fromApp = '1'
        return urlBuild(urlObj, _query)
    }

    makeWebUrl(url: string) {
        return url
    }
}

export default RouterStore

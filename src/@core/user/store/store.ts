import {action, computed, makeObservable, observable} from "mobx"
import {makePersistable} from "mobx-persist-store"
import {services} from "~services"
import {
    TActionUser,
    TAuthConfirmProviderCode,
    TGqlScopeUserBoot,
    TGqlScopeUserUser,
    TLoginFlow,
    TSessionData
} from "@core/user/types";
import CommonStore from "@core/main/lib/store/common";
import {classComputedPropsCache} from "@core/main/lib/mobx/class-computed-props-cache";
import {UserModel} from "@core/user/model/User";
import {UserEditableModel} from "@core/user/model/UserEditable";
import {AppClient, MutationUserPubAppClientArgs, User, UserFamily} from "~gql/api";
import {logComputed} from "@core/main/lib/mobx/log-computed";
import AppConfig from "@core/main/config";
import checkPhone from "@core/main/util/validate/checkPhone";
import {busService} from "@core/main/service/bus";
import {randID} from "@core/main/util/base";
import {task} from "@core/main/lib/decorator/task";
import QUERY_USER_FETCH, {TUserFetchTask} from "../gql/query/user_fetch";
import QUERY_APP_CLIENT from "../gql/query/app_client";
import MUTATE_PROFILE_ALL_FILLED, {TProfileAllFilledTask} from "../gql/mutation/profile_all_filled";
import MUTATE_LOGOUT from "../gql/mutation/logout";
import MUTATE_APP_CLIENT from "../gql/mutation/app_client";
import {AppClientModel} from "@core/user/model/AppClient";

export class UserStore extends CommonStore {

    @observable
    authConfirmProviderCode: TAuthConfirmProviderCode | null = null

    @observable
    authed: boolean = false

    @observable
    loginFlow: TLoginFlow = {}

    @observable
    onLoginDoneAction?: any

    @observable
    phoneInput?: string = ''

    @observable
    clientId?: string | null

    @observable
    clientNid?: number | null

    @observable
    token?: string | null

    @observable
    sessionId?: string | null

    @observable
    userId?: number | null

    @observable
    fuserId?: number | null

    @observable
    user?: UserModel | null

    @observable
    userEditable?: UserEditableModel | null

    @observable
    appClient?: AppClientModel

    constructor() {
        super()
        makeObservable(this)
        makePersistable(this, {
            name: UserStore.name,
            properties: ['clientId', 'clientNid', 'sessionId', 'token'],
        })
    }

    @action
    setAuthed() {
        this.authed = !this.authed
    }

    @action
    ensureClientId() {
        if (!this.clientId) {
            this.clientId = randID(20)
            console.log('Ensure clientId: generate', this.clientId)
        } else {
            console.log('Ensure clientId: exist', this.clientId)
        }
    }

    boot() {
        this.stores().menu.registerActionChannel('user', this.runAction.bind(this))
    }

    init() {
        this.disposers = classComputedPropsCache(this, [])
        this.bus().on('profile:updated', this.onProfileUpdated.bind(this))
    }

    @action
    async onProfileUpdated() {
        this.stores().page.fetchPage('/user/profile')
    }

    @computed get isAuthorizedTest(): boolean {
        logComputed(this, 'isAuthorizedTest')
        return true
    }

    @computed get isAuthorized(): boolean {
        logComputed(this, 'isAuthorized')
        return !!this.userId
    }

    @action
    async ensureSession(): Promise<{
        sessionId: string,
        userId: string
    }> {
        const res: any = await services.rest.requestGet('user/session')
        this.updateSession({
            sessionId: res.sessionId,
            userId: res.userId
        })
        return res
    }

    @action
    updateSession(
        {
            appClient,
            token,
            sessionId,
            userId,
            fuserId
        }: {
            appClient?: AppClient,
            token?: string | null,
            sessionId?: string | null,
            userId?: number | null,
            fuserId?: number | null
        }
    ) {
        if (appClient)
            this.updateAppClient(appClient)

        if (token)
            this.token = token

        if (sessionId)
            this.sessionId = sessionId

        if (fuserId)
            this.fuserId = fuserId

        if (!userId) {
            this.user = null
            this.userId = null
        } else {
            this.userId = userId
        }

        this.socketSessionUpdate()
    }

    socketSessionUpdate() {
        this.services().websocket.sendMessage({
            name: 'socket.sessionUpdate',
            data: this.getSessionData()
        })
    }

    @action
    resetSession() {
        this.sessionId = null
        this.userId = null
        this.fuserId = null
        this.user = null
    }

    @action
    resetClientId() {
        this.clientId = null
        this.token = null
    }

    @action
    async logout() {
        await MUTATE_LOGOUT.request({})
        this.stores().sale.logout()
        this.resetSession()
        await this.queryAppClient()
        await this.stores().page.fetchPage('/user/profile')
    }

    @action
    SCOPE_BOOT(data: TGqlScopeUserBoot) {
        if (data.session) {
            if (data.session.SESSION_ID) {
                this.updateSession({
                    sessionId: data.session.SESSION_ID,
                    userId: data.session.USER_ID,
                    fuserId: data.session.FUSER_ID,
                })
            }
        }
    }

    @action
    SCOPE_SESSION() {

    }

    @action
    SCOPE_USER(data: TGqlScopeUserUser) {
        if (data.user) {
            this.user = new UserModel(data.user)
        }
    }

    @action
    setUser(user: User) {
        this.user = new UserModel(user)
    }

    @action
    setEmail(email: string) {
        if (this.user)
            this.user.EMAIL = email
    }

    @action
    setFamily(family: UserFamily[]) {
        if (this.user)
            this.user.FAMILY = family
    }

    @action
    userEdit(reload = false) {
        if ((!this.userEditable || reload) && this.user) {
            this.userEditable = this.user.getEditableModel()
        }
        return this.userEditable
    }

    @action
    async setPhone(phone: string) {
        this.phoneInput = phone
    }

    @action
    navLogin(params: TLoginFlow) {

        const vorder = this.stores().vorder
        const phone = vorder.attrValue['PHONE']

        if (phone && checkPhone(phone)) {
            busService.emitter.emit('user:phone.update', phone)
            this.setPhone(phone)
        }

        this.setLoginFlow(params)
        this.loginFlow.backlink = this.stores().router.currentRoute.path
        const path = '/login' + (this.loginFlow.query ? '?' + this.loginFlow.query : '')

        console.log('navLogin', path)
        this.stores().router.replace(path, false)
    }

    @action
    setLoginFlow(params: TLoginFlow) {
        this.loginFlow = params
    }

    onLoginSkip() {
        this.onLoginNext()
    }

    onLoginSuccess() {
        this.onLoginNext()
    }

    onLoginNext() {
        if (
            this.loginFlow.checkAddress &&
            !this.stores().sale.userOrderProfiles.length &&
            this.stores().vorder.isTransportCourier
        ) {
            this.stores().router.push('/sale/address?context=login')
        } else {
            this.onLoginRedirect()
        }
    }

    @action
    onLoginRedirect() {
        switch (this.loginFlow.redirect) {
            case 'profile':
                if (this.isAuthorized) {
                    this.stores().router.replace('/user')
                } else {
                    this.stores().router.replace(AppConfig.APP_FRONT_PAGE)
                }
                break;
            case 'current':
                this.stores().router.replace(this.loginFlow.backlink)
                break;
            default:
                this.stores().router.replace(AppConfig.APP_FRONT_PAGE)
                break;
        }
        if (this.isAuthorized) {
            if (this.loginFlow.onSuccess) {
                this.loginFlow.onSuccess()
            }
        } else {
            if (this.loginFlow.onCancel) {
                this.loginFlow.onCancel()
            }
        }
        if (this.loginFlow.onReady) {
            this.loginFlow.onReady()
        }
    }

    @computed
    get phoneNormalized() {
        logComputed(this, 'phoneNormalized')
        return this.phoneInput
    }

    @action
    async onAuth(data: TSessionData) {
        this.updateSession(data)
        await this.stores().main.scopesFetch(['session', 'user'])
        await this.stores().page.fetchPage('/user/profile')
        this.stores().app.alertsQueueFill()
        this.stores().vorder.setup()
    }

    @task
    queryUserFetch = (async (variables) => {
        try {
            const res = await QUERY_USER_FETCH.request({variables}, {throwError: true});
            if (res) {
                this.setUser(res)
            }
            return res
        } catch (e) {
        }
    }) as TUserFetchTask

    getExternalSessionParams() {
        return {
            ...this.getSessionData(),
            clientId: this.clientId
        }
    }

    @computed
    get userNameOrGuest() {
        return this.user ? this.user.GREETING_NAME : 'Гость'
    }

    getPhone() {
        return this.user ? this.user.PHONE : this.phoneInput
    }

    @computed
    get phone() {
        return this.getPhone()
    }

    getSessionData() {
        const res: TSessionData = {};
        ['token', 'sessionId', 'fuserId', 'userId', 'phone'].forEach((key) => {
            // @ts-ignore
            if (this[key]) res[key] = this[key]
        })
        return res
    }

    makeRequestSessionContext(ctx: any = {}) {

        const userStore = this
        const mainStore = this.stores().main

        const newCtx = {
            ...ctx,
            headers: {
                ...ctx.headers,
            }
        }

        if (userStore.sessionId) {
            newCtx.headers.Cookie = `PHPSESSID=${userStore.sessionId}`
        } else {
            delete newCtx.headers.Cookie
        }

        if (this.clientId)
            newCtx.headers['Client-Id'] = this.clientId

        if (this.token)
            newCtx.headers['Authorization'] = 'Bearer ' + this.token

        newCtx.headers['Client-Context'] = JSON.stringify(mainStore.httpClientContext)
        newCtx.headers['App-Id'] = 'mobile-app'
        return newCtx
    }

    @action
    runAction(action: Partial<TActionUser>) {
        const {params, payload} = action
        switch (action.type) {
            case 'reload': {
                this.queryUserFetch({})
                this.emitProfileUpdated()
                break
            }
            case 'socketSessionUpdate': {
                this.socketSessionUpdate()
                break
            }
            case 'sessionScopesReload': {
                const sessionScopes = this.isAuthorized ? ['app', 'session', 'user'] : ['app', 'session']
                this.stores().main.scopesFetch(sessionScopes)
                break
            }
            case 'auth': {
                this.onAuth(payload)
                break
            }
            case 'mutateProfileAllFilled': {
                this.mutateProfileAllFilled({})
                break
            }
        }
    }

    @action
    getClientNid() {
        if (!this.clientNid)
            this.clientNid = Math.round(Math.random() * 100000)
        return this.clientNid

    }

    emitProfileUpdated() {
        this.bus().emit('profile:updated')
    }

    @task
    mutateProfileAllFilled = (async () => {
        const res = await MUTATE_PROFILE_ALL_FILLED.request({})
        if (res.state.success) {
            const notice = res.payload?.notice
            if (notice) {
                // this.stores().notice.onEventNewNotice(notice)
            }
            this.runAction({
                type: 'reload',
            })
        }
        return res;
    }) as unknown as TProfileAllFilledTask

    @action
    setAuthConfirmProviderCode(code: TAuthConfirmProviderCode) {
        this.authConfirmProviderCode = code
    }

    async queryAppClient() {
        console.log('Query app client')
        try {
            const appClient = await QUERY_APP_CLIENT.request({});
            if (appClient) {
                console.log('appClient', appClient)
                this.updateAppClient(appClient)
            } else {
                console.log('No app client')
            }
        } catch (e) {
            console.log('Query app client ERROR', e)
        }

    }

    @action
    async updateAppClient(appClient: AppClient) {

        console.log('updateAppClient', appClient)

        this.appClient = new AppClientModel(appClient)

        if (appClient.CURRENT_SESSION_ID)
            this.sessionId = appClient.CURRENT_SESSION_ID

        if (appClient.TOKEN)
            this.token = appClient.TOKEN

        if (appClient.CLIENT_ID && this.clientId !== appClient.CLIENT_ID)
            this.clientId = appClient.CLIENT_ID

        if (appClient.DEBUG_PARAMS) {
            this.stores().debug.setClientDebugParams(appClient.DEBUG_PARAMS)
        }
    }

    async updatePushToken(token: string) {
        if (this.appClient) {
            this.appClient.setMobilePushToken(token)
            this.apiMutateAppClient()
        }
    }

    async apiMutateAppClient() {
        if (!this.appClient)
            return;
        await MUTATE_APP_CLIENT.request({
            variables: {
                debugParams: this.appClient.getDebugParams(),
                mobilePushToken: this.appClient.getMobilePushToken()
            }
        })
        console.log('apiMutateAppClient')
    }
}

export default UserStore

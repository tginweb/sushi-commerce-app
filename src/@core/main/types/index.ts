// `stores` layer
import React from "react";
import {MutationOptions, QueryOptions} from "@apollo/client/core/watchQueryOptions";
import {ViewStyle} from "react-native";
import {UiBtnProps} from "~ui/btn";
import {ActionMobile, ClientNotice, Condition, MenuItemMobile} from "~gql/api";
import {Notification} from "expo-notifications";
import {ViewProps} from "react-native-ui-lib";
import {Task} from "@core/main/lib/decorator/task";
import {DebugEvent} from "@core/main/model/DebugEvent";

// System
export type TVoid = Promise<void>
export type TAnyObj = Record<string, unknown>
export type TPureFunc = () => void
export type TPureFuncAsync = () => TVoid
export type TPureFuncArg<T> = (value?: T) => void
export type TNullable<T> = T | null | undefined
export type TMaybe<T> = T | null | undefined | void

export type TStoreDefaultKeys = 'set' | 'setMany' | 'hydrate';
export type TStoreKeysOf<S> = keyof Omit<S, TStoreDefaultKeys>;


export interface IStore {
    booted?: boolean
    inited?: boolean
    hydrate?: () => TVoid;
    boot?: () => TVoid;
    init?: () => TVoid;
}

export interface IService {
    booted?: boolean
    inited?: boolean
    boot?: () => TVoid;
    init?: () => TVoid;
}

export type TMessage = {
    type?: 'error' | 'success' | 'info' | 'warning'
    loading?: boolean
    content?: any
    bgColor?: string
    title?: string | null
    message?: string | null
    color?: string
    code?: string
    ref?: string
    duration?: number
    placement?: 'top' | 'bottom'
    offset?: number
    progress?: number
    onPress?: ({id, hide}: { id: any, hide: () => void }) => void
    actions?: MenuItemMobileExtended[]
    route?: any
    temporary?: Boolean
    actionsInline?: Boolean
    actionsProps?: UiBtnProps
}

export type TMessages = TMessage[]

export type MenuItemMobileExtended = MenuItemMobile & {
    onPress?: () => void
}

export type TScreenProps = {
    route: any
}

export type TValidateMode = 'all' | 'first' | undefined | null

export type TValidatableComponentHandle = {
    validate: (mode?: TValidateMode, errorsCollector?: TValidateErrors) => TValidateResult | undefined
    validateReset: () => any
    clear?: () => any
    open?: () => any
}

export type TValidateRuleResult = boolean | string | null | undefined | TValidateError

export type TValidateRule = ((v: any, ctx?: any) => TValidateRuleResult) | TValidator

export type TValidateRules = TValidateRule[]

export type TValidateError = TMessage

export type TValidateErrors = TValidateError[]

export type TValidateResult = TValidateErrors | true | null

export type TPresetName = string | string[]

export type TComponentRenderFunc = (props: { index: number }) => React.ReactNode

export type TComponentRenderConditionContext = {
    stores: TAppStores
}

export type TComponentRenderInfo = {
    name?: string
    open?: ((props: TComponentRenderConditionContext) => void),
    component: TComponentRenderFunc,
    condition?: boolean | ((props: TComponentRenderConditionContext) => boolean),
    props?: any,
    key?: string,
    group?: string
}

export type TComponentRender = TComponentRenderInfo | TComponentRenderFunc | React.ReactNode

export type TComponentRenderers = TComponentRender[]

export type TAppScreenProps = TAppScreenData & {
    onActionUpdate?: () => void
    onActionReload?: () => void
    onActionSkip?: () => void
}

export type TAppScreenData = {
    actions?: (UiBtnProps | 'site' | 'update' | 'reload' | 'skip' | 'contact')[]
    title?: string
    message?: string
}

export type TIconProps = {
    color?: string
    size?: number | string
    width?: number | string
    height?: number | string
    loading?: boolean
    style?: ViewStyle
    key?: any
}

export type TIconRender = (props: TIconProps) => any

export type TFetchableState<T> = {
    loading?: boolean,
    fetchedTs?: number | null
    data: T
}

export type TFetchableOptions = {
    cache?: string | boolean | number | null
}

export type TPaddingMode = boolean | null | 'hv' | 'h' | 'v'

export type TGraphqlRequestMutationOptions<TData, TArgs> = Pick<MutationOptions<TData, TArgs>, Exclude<keyof MutationOptions, 'mutation'>>;

export type TGraphqlRequestQueryOptions<TData, TArgs> = Pick<QueryOptions<TArgs, TData>, Exclude<keyof QueryOptions, 'query'>>;

enum TGraphqlRequestThrowOn {
    FATAL = "fatal",
    UNSUCCESS = "unsuccess",
}

export type TGraphqlRequestParams = {
    throwInternalError?: boolean
    throwUserError?: boolean
    throwError?: boolean | TGraphqlRequestThrowOn[]
    state?: TGraphqlRequestMutationParamsState & TGraphqlRequestQueryParamsState
    name?: string
    log?: TDebugContext | boolean
}

export type TGraphqlRequestQueryParamsState = {
    process: boolean
    querying?: boolean
    queried?: boolean
}

export type TGraphqlRequestMutationParamsState = {
    process: boolean
    mutating?: boolean
    mutated?: boolean
}

export type TGraphqlRequestQuery<TResult, TVariables> = (
    queryOptions: TGraphqlRequestQueryOptions<TResult, TVariables>,
    params?: TGraphqlRequestParams
) => Promise<TResult>


export type TGraphqlRequestMutation<TResult, TVariables> = (
    mutationOptions: TGraphqlRequestMutationOptions<TResult, TVariables>,
    params?: TGraphqlRequestParams
) => Promise<TResult>

export type TAppContact = {
    type?: 'phone' | 'email' | 'vk' | 'ok'
    label?: string
    url?: string
    view?: string
    show: boolean
}

export type TLayoutMeasure = {
    x: number,
    y: number,
    width: number,
    height: number,
    pageX: number,
    pageY: number,
    centerX?: number,
    centerY?: number,
}

export type TLayoutSize = {
    x: number,
    y: number,
    width: number,
    height: number,
    pageX: number,
    pageY: number,
    centerX: number,
    centerY: number,
}

export type TOptional<T> = T | null | undefined


export type TComponentable<TProps> = React.ReactNode | ((props: TProps) => React.ReactNode)

export type TValign = 'top' | 'bottom' | 'middle' | null

export interface TAppStores {
}

export interface TAppServices {
}

export type PartialRecord<K extends keyof any, T> = {
    [P in K]?: T;
}

export type TComponentTargetProps<T extends string | number | symbol> = Record<T, {
    props: {
        [key: string]: any;
    },
    style: ViewStyle
}>

export type TComponentTargetStyles<T extends string | number | symbol> = Record<T, ViewStyle>

export interface IEntityWithPrefetchableImage {
    getImagePrefetchUrl?(): string | null | undefined
}

export type TFilterControlOption<T> = {
    label: string
    value: T
}

export type TFilterControlProps = {
    scrollTo?: boolean
    parentId?: string
    id?: string
    label?: string
    onChange?: (v: any) => void
    value: any
    filter: TFilterItem
    scrollRefs?: any
    container?: ViewProps
}

export type TFilterOption = {
    label: string
    value?: string | number | null
    parentValues?: number[]
    active?: boolean
    dismissable?: boolean
}

export type TFilterItem = {
    type: 'boolean' | 'string' | 'number'
    multiple?: boolean
    name?: string
    value?: string
    options?: TFilterOption[]
    field?: ViewProps & {
        component?: any
        label?: string
        icon?: any
    }
    control?: {
        component?: any
        container?: any
        props?: any
        label?: string
        icon?: any
    }
}

export type TTemplateValueWrapper = (v: string | number) => string | number | JSX.Element

export type TComponentInfo = {
    renderer?: any
    presets: any
}

export type TCommonDialogProps = {
    onCloseOnce?: any
    onSuccess?: (data: any) => void
}

export type TConditional = Condition | Condition[]

export type TBuildableComponentProps = {
    vars?: any
    templatableProps?: string[] | string
    condition?: TConditional
}

export type TValidator = TValidatorEmail | TValidatorPhone | TValidatorNumber | TValidatorRequired | TValidatorString

export type TValidatorCommon = {
    message?: string
}

export type TValidatorEmail = TValidatorCommon & {
    type: 'email'
}

export type TValidatorPhone = TValidatorCommon & {
    type: 'phone'
}

export type TValidatorNumber = TValidatorCommon & {
    type: 'number'
    min?: number
    max?: number
}

export type TValidatorRequired = TValidatorCommon & {
    type: 'required'
}

export type TValidatorString = TValidatorCommon & {
    type: 'string'
    min?: number
    max?: number
    regexp?: string
}

export type PropsWithKey<P = unknown> = P & { key?: any }

export type PartialWithKey<P = unknown> = Partial<P & { key?: any }>

export type TRouteState = {
    pathname: string
    params: any
    canGoBack: boolean
}


export type TPushNotification = {
    id: string
    notification: Notification
    type: 'notice' | 'other'
    notice?: ClientNotice
}

export type TDirectionVertical = 'up' | 'down'
export type TDirectionHorizontal = 'left' | 'right'

export type TScrollState = {
    offset: number
    direction: TDirectionVertical | null
    directionPrev: TDirectionVertical | null
    directionStartOffset: number
    directionOffset: number
    speed: number
    speedTimeout: any
    speedLastPos: number
}

export type TCleanLocalAddressBehavior = boolean | 'region' | 'city'

export type TMenuAction = MenuItemMobile | ActionMobile | string

export type TDebugEventType = 'info' | 'error' | 'fatal' | 'warning'

export type TDebugEventScope = 'boot' | 'design' | 'router' | 'request' | 'render' | 'store' | 'dump' | 'websocket'

export type TDebugEventScopeInfo = {
    name: TDebugEventScope
}

export type TDebugEvent = {
    uid?: string
    name?: string
    type: TDebugEventType
    message: string
    data?: any
    scope?: TDebugEventScope | TDebugEventScope[]
    channel?: TDebugDeliveryChannelType
    createdAt?: number
    session?: {
        clientId?: string
        sessionId: string
        userId: number
        phone: string
        vorderId: number
    }
}

export type TDebugEventTypeInfo = {
    name: TDebugEventType
}

export type TDebugContext = {
    type?: TDebugEventType
    name?: string
}

export type TDeferredFetchTask = {
    name?: string
    condition?: (stores?: TAppStores) => boolean
    task: Task<any, any>
    onResolve?: any
    args?: any
}

export type TWebsocketMessage = {
    name: string
    data: any
}

export type TWebsocketInboundMessage = {
    name: string
    data: any
}

export type TDebugDeliveryChannelType = 'server' | 'console' | 'panel' | 'history'

export type TDebugDeliveryChannelTypeInfo = {
    name: TDebugDeliveryChannelType
}

export type TDevConsolePanelItem = {
    uid: string
    event: DebugEvent
    dataFormatted: string | null
    readed?: boolean
}

export type TAction = {
    channel?: unknown

    url?: string
    path?: string
    pathFull?: string
    query?: any

    params?: ActionMobile & Record<string, any>
    action?: ActionMobile
}

export type TActionRouter = TActionRouterNav

export type TActionRouterNav = TAction & {
    channel: 'route'
    type: 'nav'
}

export type TActionTelegram = TActionTelegramNav

export type TActionTelegramNav = TAction & {
    channel: 'tg'
    type: 'nav'
}

export type TActionSite = TActionSiteNav

export type TActionSiteNav = TAction & {
    channel: 'site'
    type: 'nav'
}

export type TActionDialog = TActionDialogNav

export type TActionDialogNav = TAction & {
    channel: 'dialog'
    type: 'nav'
}


export type TActionMain = TActionMainScopesFetch

export type TActionMainScopesFetch = TAction & {
    channel: 'main'
    type: 'scopesFetch'
    payload: string[] | string
}


export type Href = string | {
    pathname: string
    params?: any
}

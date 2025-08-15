import {AppClient, User, UserSession} from "~gql/api";
import {TAction} from "@core/main/types";

export type TGqlScopeUserBoot = {
    session: UserSession
}

export type TGqlScopeUserUser = {
    user: User
}

export type TLoginFlow = {
    onSuccess?: () => void
    onCancel?: () => void
    onReady?: () => void
    query?: string
    redirect?: string | 'current' | 'front' | 'profile'
    backlink?: string
    checkAddress?: boolean
}

export type TSessionData = {
    appClient?: AppClient
    token?: string
    sessionId?: string
    userId?: number
    fuserId?: number
    phone?: string
}

export type TActionUser =
    TActionUserReload
    | TActionUserSocketSessionUpdate
    | TActionUserSessionScopeReload
    | TActionUserAuth
    | TActionUserMutateProfileAllFilled


export type TActionUserReload = TAction & {
    channel?: 'user'
    type: 'reload'
}

export type TActionUserSocketSessionUpdate = TAction & {
    channel?: 'user'
    type: 'socketSessionUpdate'
}

export type TActionUserSessionScopeReload = TAction & {
    channel?: 'user'
    type: 'sessionScopesReload'
}

export type TActionUserAuth = TAction & {
    channel?: 'user'
    type: 'auth'
    payload: TSessionData
}

export type TActionUserMutateProfileAllFilled = TAction & {
    channel?: 'user'
    type: 'mutateProfileAllFilled'
}

export type TAuthConfirmProviderCode = 'call' | 'telegram' | 'sms' | 'outcall'

import {action, makeObservable} from "mobx"
import {AppClient, AppClientDebugParams} from "~gql/api";

export class AppClientModel {

    ID: number = 0
    CLIENT_ID: string = ''
    CURRENT_SESSION_ID: string = ''
    DEBUG_PARAMS: AppClientDebugParams = {}
    SESSION_ID: string = ''
    TOKEN: string = ''
    MOBILE_PUSH_TOKEN: string = ''
    USER_ID: number = 0

    constructor(data: AppClient) {
        Object.assign(this as any, data)
        makeObservable(this)
    }

    @action
    setMobilePushToken(token: string) {
        this.MOBILE_PUSH_TOKEN = token
    }

    getMobilePushToken() {
        return this.MOBILE_PUSH_TOKEN
    }

    @action
    setDebugParam(paramName: string, paramValue: any) {
        // @ts-ignore
        this.DEBUG_PARAMS[paramName] = paramValue
    }

    getDebugParams() {
        return this.DEBUG_PARAMS
    }
}

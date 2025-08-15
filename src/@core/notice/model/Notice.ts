import {ActionMobile, ClientNotice, MenuItemMobile} from "~gql/api";
import {TMessage} from "@core/main/types";
import {makeObservable, observable} from "mobx";
import toArray from "@core/main/util/base/toArray";

export class NoticeModel {

    id: number = 0
    offerId: number = 0
    title: string = ''
    message: string = ''
    body: string = ''
    bodyHtml: string = ''
    createdAt: number = 0
    eventName: string = ''
    eventData: any = {}
    eventGroup: string = ''
    targetCode: string = ''
    showAs: 'alert' | 'dialog' | null = null
    image: string | null = ''
    actionsMobile: MenuItemMobile[] = []
    actionsEmitMobile: ActionMobile[] = []
    haveBody: boolean = false

    @observable
    isReaded: boolean = false

    @observable
    isReadedLocal: boolean = false

    @observable
    isShown: boolean = false

    constructor(data: ClientNotice) {
        Object.assign(this as any, data)
        makeObservable(this)
    }

    setIsReaded(state: boolean) {
        this.isReaded = state
    }

    setIsReadedLocal(state: boolean) {
        this.isReadedLocal = state
    }

    setIsShown(state: boolean) {
        this.isShown = state
    }

    getIsReaded() {
        return this.isReaded || this.isReadedLocal || this.isShown && !this.haveBody
    }

    getStartupRunAction() {
        return this.actionsMobile.find(action => toArray(action.roles).includes('startupRun'))
    }

    getToastMessage(): TMessage {
        return {
            type: 'info',
            title: this.title,
            message: this.message,
            actions: this.actionsMobile,
        }
    }
}

import {action, computed, makeObservable, observable} from "mobx"
import {ActionMobile, MenuItemMobile, MenuMobile} from "~gql/api"
import CommonStore from "@core/main/lib/store/common";
import {TAction, TMenuAction} from "@core/main/types";
import * as Linking from "expo-linking";
import splitWithTail from "@core/main/util/base/splitWithTail";
import {classComputedPropsCache} from "@core/main/lib/mobx/class-computed-props-cache";
import {logComputed} from "@core/main/lib/mobx/log-computed";
import urlParse from "@core/main/util/base/urlParse";
import excludeEmptyFields from "@core/main/util/base/excludeEmptyFields";
import ltrim from "locutus/php/strings/ltrim";

export class MenuStore extends CommonStore {

    @observable
    menus: MenuMobile[] = []

    actionChannels: Record<string, (action: TAction) => any> = {}

    constructor() {
        super()
        makeObservable(this)
    }

    registerActionChannel(name: string, callback: () => any) {
        this.actionChannels[name] = callback
    }

    @action
    SCOPE_APP(data: any) {
        if (data.menus) this.menus = data.menus
    }

    init() {
        this.disposers = classComputedPropsCache(this, [])
    }

    boot() {

    }


    @computed
    get menuItems() {
        logComputed(this, 'menuItems')
        return this.menus.reduce<Record<string, MenuItemMobile[]>>((map, item) => {
            map[item.code || ''] = item.children || []
            return map
        }, {})
    }

    extractAction(item: TMenuAction) {
        let action: ActionMobile | null = null
        if (typeof item === 'string') {
            action = {
                url: item
            }
        } else if (typeof item === 'object') {
            if (item.__typename === 'MenuItemMobile' && item.action) {
                action = item.action
            } else {
                action = item as ActionMobile
            }
        }
        return action
    }

    async runActionItems(items: TMenuAction[]) {
        if (items && items.length) {
            for (const item of items) {
                let action = this.extractAction(item)
                if (action) {
                    if (action.await) {
                        await this.runAction(action)
                    } else {
                        this.runAction(action)
                    }
                }
            }
        }
    }

    async runActionItem(item: TMenuAction) {
        return this.runAction(this.extractAction(item))
    }

    async runAction(actionData?: ActionMobile | null) {

        console.log('runAction', actionData)
        if (!actionData)
            return;

        const url = actionData.url || ''

        const [channel, pathFull] = splitWithTail(url, '://', 1)

        const urlParsed = urlParse(pathFull)
        const query = urlParsed.query
        const path = ltrim(urlParsed.pathname, '/')

        const params = {
            ...query,
            ...excludeEmptyFields(actionData)
        }

        const [actionType, actionPayload] = splitWithTail(path, '.', 2)

        const action: TAction = {
            channel,
            url,
            pathFull,
            path,
            query,
            params,
            type: actionType,
            payload: actionPayload,
            action: actionData
        }

        if (this.actionChannels[channel]) {
            this.actionChannels[channel](action)
        } else {
            Linking.openURL(url)
        }
    }
}

export default MenuStore

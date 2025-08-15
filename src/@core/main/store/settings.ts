import {action, computed, makeObservable, observable} from "mobx"
import {Setting} from "~gql/api"
import configService from "@core/main/service/config";
import CommonStore from "@core/main/lib/store/common";
import {classComputedPropsCache} from "@core/main/lib/mobx/class-computed-props-cache";
import {logComputed} from "@core/main/lib/mobx/log-computed";

export class SettingsStore extends CommonStore {
 
    @observable
    settings: Setting[] = []

    constructor() {
        super()
        makeObservable(this)
    }

    init() {
        this.disposers = classComputedPropsCache(this, [])
    }

    @action
    SCOPE_BOOT(data: any) {
        if (data.settings) this.loadSettings(data.settings)
    }

    loadSettings(settings: any) {
        this.settings = settings
        configService.assign(this.settingValue)
    }

    @computed
    get settingValue() {
        logComputed(this, 'settingValue')
        return this.settings.reduce((map: any, item) => {
            if (item.KEY)
                map[item.KEY] = item.VALUE
            return map
        }, {})
    }
}

export default SettingsStore

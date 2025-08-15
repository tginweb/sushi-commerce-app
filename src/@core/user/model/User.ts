import {computed, makeObservable, toJS} from "mobx"
import {EntityProp, User, UserFamily} from "~gql/api";
import {createViewModel} from "mobx-utils";
import {UserEditableModel} from "@core/user/model/UserEditable";
import checkPhone from "@core/main/util/validate/checkPhone";
import {logComputed} from "@core/main/lib/mobx/log-computed";

export class UserModel {

    ID: number = 0
    EMAIL?: string

    LOGIN?: string
    LOGIN_FORMAT?: string
    NAME?: string
    GREETING_NAME?: string
    PERSONAL_BIRTHDAY?: string
    PHONE?: string
    PHONE_FORMATTED?: string
    FAMILY: UserFamily[] = []

    PROPS: EntityProp[] = []
    PROFILE_GIFT_USED: boolean = false

    constructor(data: User) {
        Object.assign(this as any, data)
        makeObservable(this)
    }

    getEditableModel() {
        return new UserEditableModel({
            ID: this.ID,
            NAME: this.NAME,
            EMAIL: this.EMAIL,
            PHONE: this.PHONE,
            PERSONAL_BIRTHDAY: this.PERSONAL_BIRTHDAY,
            FAMILY: this.FAMILY,
            PROPS: this.PROPS
        })
    }

    getClone(viewModel = false) {
        const model = new UserModel(toJS(this))
        return viewModel ? createViewModel(model) : model
    }

    isPhoneValid() {
        return checkPhone(this.PHONE)
    }

    @computed
    get propValue() {
        logComputed(this, 'propValue')
        return this.PROPS.reduce<Record<string, EntityProp>>((map, item) => {
            map[item.CODE || ''] = item.VAL
            return map
        }, {})
    }
}

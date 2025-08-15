import {action, computed, makeObservable, observable, runInAction} from "mobx"
import {
    EntityProp,
    MutationUserBirthday,
    MutationUserName, MutationUserPubProfileBirthdayArgs as TArgs,
    MutationUserPubProfileEmailArgs, User,
    UserFamily,
    UserProfileSave as TResult
} from "~gql/api";
import {Task, task} from "@core/main/lib/decorator/task";
import {logComputed} from "@core/main/lib/mobx/log-computed";
import MUTATION_PROFILE_NAME, {TMutationUserProfileNameTask} from "@core/user/gql/mutation/profile_name";
import MUTATION_PROFILE_BIRTHDAY, {TMutationUserProfileBirthdayTask} from "@core/user/gql/mutation/profile_birthday";
import MUTATION_PROFILE_SAVE from "@core/user/gql/mutation/profile_save";
import MUTATION_PROFILE_EMAIL, {TMutationUserProfileEmailTask} from "@core/user/gql/mutation/profile_email";
import parseTime from "@core/main/util/date/parseTime";
import {Dayjs} from "dayjs";
import MUTATION_PROFILE_CHILD, {TMutationUserProfileChildTask} from "@core/user/gql/mutation/profile_child";

export type TUserEditableModelFields = {
    ID: number
    EMAIL?: string
    NAME?: string
    PERSONAL_BIRTHDAY?: string
    PHONE?: string
    PROPS: EntityProp[]
    FAMILY: UserFamily[]
}

export type TUserEditableSaveProfileDataAction =
    TUserEditableSaveProfileNameAction
    | TUserEditableSaveProfileBirthdayAction

type TUserEditableSaveProfileNameAction = {
    type: 'name',
    payload: string
}

type TUserEditableSaveProfileBirthdayAction = {
    type: 'birthday',
    payload: string
}

export class UserEditableModel {

    ID: number = 0

    @observable
    EMAIL?: string

    @observable
    NAME?: string

    @observable
    PERSONAL_BIRTHDAY?: string

    @observable
    PHONE?: string

    @observable
    PROPS: EntityProp[] = []

    @observable
    FAMILY: UserFamily[] = []

    constructor(data: TUserEditableModelFields) {
        Object.assign(this as any, data)
        makeObservable(this)
    }

    @action
    setFieldValue(code: keyof TUserEditableModelFields, value: any) {
        this[code as keyof typeof this] = value
    }

    @action
    setPropValues(props: Record<string, any>) {
        for (const [propCode, propValue] of Object.entries(props)) {
            this.setPropValue(propCode, propValue)
        }
    }

    @action
    setPropValue(code: string, value: any) {
        let prop = this.PROPS.find(item => item.CODE === code)
        if (!prop) {
            prop = {
                CODE: code,
                VAL: value
            }
            this.PROPS.push(prop)
        }
        prop.VAL = value
    }

    @computed
    get propValue() {
        logComputed(this, 'propValue')
        return this.PROPS.reduce<Record<string, EntityProp>>((map, item) => {
            map[item.CODE || ''] = item.VAL
            return map
        }, {})
    }

    @task
    saveProfileData = (async (action: TUserEditableSaveProfileDataAction) => {
        let res: MutationUserName | MutationUserBirthday | null = null
        try {
            switch (action.type) {
                case 'name':
                    res = await MUTATION_PROFILE_NAME.request({
                        variables: {name: action.payload}
                    })
                    if (res && res.state?.success) {
                        console.log('RES', res)
                        runInAction(() => {
                            this.NAME = action.payload
                        })
                        return res.user
                    }
                    break
                case 'birthday':
                    res = await MUTATION_PROFILE_BIRTHDAY.request({
                        variables: {birthday: action.payload}
                    })
                    if (res && res.state?.success) {
                        runInAction(() => {
                            this.PERSONAL_BIRTHDAY = action.payload
                        })
                        return res.user
                    }
                    break
            }
        } catch (e) {
            console.log(e)
        }
        return false
    }) as Task<[TUserEditableSaveProfileDataAction], User>

    @task
    saveEmail = (async (variables: MutationUserPubProfileEmailArgs) => {
        try {
            return await MUTATION_PROFILE_EMAIL.request({
                variables
            })
        } catch (e) {
            console.log(e)
            return false
        }
    }) as TMutationUserProfileEmailTask

    @task
    saveChild = (async ({child}) => {
        if (!child)
            return;

        try {

            console.log({
                variables: {
                    action: !child.ID ? 'add' : 'update',
                    child
                }
            })
            const res = await MUTATION_PROFILE_CHILD.request({
                variables: {
                    action: !child.ID ? 'add' : 'update',
                    child
                }
            })
            if (res.state?.success) {
                runInAction(() => {
                    if (res.user?.FAMILY) {
                        this.FAMILY = res.user.FAMILY
                    }
                })
            }
            return res
        } catch (e) {
            console.log(e)
            return false
        }
    }) as TMutationUserProfileChildTask

    @task
    deleteChild = (async ({child}) => {
        if (!child)
            return;
        try {
            const res = await MUTATION_PROFILE_CHILD.request({
                variables: {
                    action: !child.ID ? 'add' : 'update',
                    child
                }
            })
            if (res.state?.success) {
                runInAction(() => {
                    if (res.user?.FAMILY) {
                        this.FAMILY = res.user.FAMILY
                    }
                })
            }
            return res
        } catch (e) {
            console.log(e)
            return false
        }
    }) as TMutationUserProfileChildTask

    getSavePayload() {
        return {
            NAME: this.NAME,
            EMAIL: this.EMAIL,
            PHONE: this.PHONE,
            PERSONAL_BIRTHDAY: this.PERSONAL_BIRTHDAY,
            PROPS: this.propValue,
        }
    }

    @task
    save = (async () => {
        try {

            const res = await MUTATION_PROFILE_SAVE.request({
                variables: {
                    form: this.getSavePayload()
                }
            })
            return res
        } catch (e) {
            console.log(e)
            return false
        }
    }) as Task<[], TResult>

    @computed
    get birthdayObject() {
        return this.PERSONAL_BIRTHDAY ? parseTime(this.PERSONAL_BIRTHDAY, 'date', 'dayjs') as Dayjs : null
    }
}

import {action, makeObservable} from "mobx"
import {OrderProfileModel} from "@core/sale/model/OrderProfile"
import DialogStore from "@core/main/lib/store/dialog";
import {TCommonDialogProps} from "@core/main/types";

export type TProfileMapDialogProps = TCommonDialogProps & {
    profile?: OrderProfileModel
    withDetails?: boolean
    context?: 'vorder' | 'profile'
    profileId?: number
    onSaved?: (profile: OrderProfileModel, action: 'save' | 'create') => void
    onDeleted?: (profile: OrderProfileModel) => void
}

export class ProfileMapDialogStore extends DialogStore<TProfileMapDialogProps> {

    constructor() {
        super()
        makeObservable(this)
    }

    @action
    showProfile(profile: OrderProfileModel, props: Partial<TProfileMapDialogProps> = {}) {
        this.show({
            profile: profile.ID ? profile.getClone(true) : profile,
            ...props
        })
    }
}

export default ProfileMapDialogStore

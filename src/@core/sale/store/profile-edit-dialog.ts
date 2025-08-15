import {action, makeObservable} from "mobx"
import {OrderProfileModel} from "@core/sale/model/OrderProfile"
import DialogStore from "@core/main/lib/store/dialog";
import {TCommonDialogProps} from "@core/main/types";

export type TProfileEditDialogProps = TCommonDialogProps & {
    profile?: OrderProfileModel
    context?: 'vorder' | 'profile'
    profileId?: number
    onSaved?: (profile: OrderProfileModel, action: 'save' | 'create') => void
    onDeleted?: (profile: OrderProfileModel) => void
}

export class ProfileEditDialogStore extends DialogStore<TProfileEditDialogProps> {

    constructor() {
        super()
        makeObservable(this)
    }

    @action
    showProfile(profile: OrderProfileModel, props: Partial<TProfileEditDialogProps> = {}) {
        this.show({
            profile: profile.ID ? profile.getClone(true) : profile,
            ...props
        })
    }
}

export default ProfileEditDialogStore

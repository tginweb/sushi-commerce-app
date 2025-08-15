import {action, makeObservable} from "mobx"
import {OrderProfileModel} from "@core/sale/model/OrderProfile"
import DialogStore from "@core/main/lib/store/dialog";
import {TCommonDialogProps} from "@core/main/types";

export type TProfileDialogProps = TCommonDialogProps & {
    profile?: OrderProfileModel
    context?: 'vorder' | 'profile'
    profileId?: number
}

export class ProfileDialogStore extends DialogStore<TProfileDialogProps> {

    constructor() {
        super()
        makeObservable(this)
    }

    @action
    setProfile(profile: OrderProfileModel) {
        this.props.profile = profile.ID ? profile.getClone(true) : profile
    }

    @action
    showProfile(profile: OrderProfileModel) {
        this.show({
            profile: profile.getClone(true)
        })
    }
}

export default ProfileDialogStore

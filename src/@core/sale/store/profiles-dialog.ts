import {makeObservable} from "mobx"
import DialogStore from "@core/main/lib/store/dialog";
import {TCommonDialogProps} from "@core/main/types";

export type TProfilesDialogProps = TCommonDialogProps & {}

export class ProfilesDialogStore extends DialogStore<TProfilesDialogProps> {

    constructor() {
        super()
        makeObservable(this)
    }

}

export default ProfilesDialogStore

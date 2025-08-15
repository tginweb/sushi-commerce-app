import {makeObservable} from "mobx"
import DialogStore from "@core/main/lib/store/dialog";
import {TCommonDialogProps} from "@core/main/types";

export type TNoticesDialogProps = TCommonDialogProps & {}

export class NoticesDialogStore extends DialogStore<TNoticesDialogProps> {

    constructor() {
        super()
        makeObservable(this)
    }

}

export default NoticesDialogStore

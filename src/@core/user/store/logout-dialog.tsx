import {makeObservable} from "mobx";
import DialogStore from "@core/main/lib/store/dialog";
import {TCommonDialogProps} from "@core/main/types";

export type TLogoutDialogProps = TCommonDialogProps & {
    str: string
}

type TProps = TLogoutDialogProps

export class LogoutDialogStore extends DialogStore<TProps> {
    constructor() {
        super()
        makeObservable(this)
    }
}

export default LogoutDialogStore

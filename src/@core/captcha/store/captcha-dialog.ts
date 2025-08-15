import {makeObservable} from "mobx"
import DialogStore from "@core/main/lib/store/dialog";
import {TCaptchaDialogProps} from "@core/captcha/types";

export class CaptchaDialogStore extends DialogStore<TCaptchaDialogProps> {
    constructor() {
        super()
        makeObservable(this)
    }
}

export default CaptchaDialogStore

import {makeObservable} from "mobx"
import DialogStore from "@core/main/lib/store/dialog";
import {TCommonDialogProps} from "@core/main/types";

export type TFaqDialogProps = TCommonDialogProps & {
    openSection?: number | string
    openElement?: number | string
}

export class FaqDialogStore extends DialogStore<TFaqDialogProps> {

    constructor() {
        super()
        makeObservable(this)
    }
}

export default FaqDialogStore

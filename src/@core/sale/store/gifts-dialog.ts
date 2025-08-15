import {makeObservable} from "mobx"
import DialogStore from "@core/main/lib/store/dialog";
import {ProductModel} from "@core/catalog/model/Product";
import {TCommonDialogProps} from "@core/main/types";

export type TGiftsDialogProps = TCommonDialogProps & {
    products?: number[]
}

export class GiftsDialogStore extends DialogStore<TGiftsDialogProps> {

    constructor() {
        super()
        makeObservable(this)
    }
}

export default GiftsDialogStore

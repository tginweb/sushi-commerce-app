import {makeObservable} from "mobx"
import DialogStore from "@core/main/lib/store/dialog";
import {OrderModel} from "@core/sale/model/Order";
import {TCommonDialogProps} from "@core/main/types";

export type TOrderPayDialogProps = TCommonDialogProps & {
    order?: OrderModel,
    savePaymentType?: boolean
}

export class OrderPayDialogStore extends DialogStore<TOrderPayDialogProps> {
    constructor() {
        super()
        makeObservable(this)
    }
}

export default OrderPayDialogStore

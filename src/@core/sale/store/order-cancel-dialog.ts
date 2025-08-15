import {makeObservable} from "mobx"
import DialogStore from "@core/main/lib/store/dialog";
import {OrderModel} from "@core/sale/model/Order";
import {TCommonDialogProps} from "@core/main/types";

export type TOrderCancelDialogProps = TCommonDialogProps & {
    order?: OrderModel
}

export class OrderCancelDialogStore extends DialogStore<TOrderCancelDialogProps> {
    constructor() {
        super()
        makeObservable(this)
    }
}

export default OrderCancelDialogStore

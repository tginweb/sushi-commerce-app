import {action, makeObservable} from "mobx"
import DialogStore from "@core/main/lib/store/dialog";
import {ProductModel} from "@core/catalog/model/Product";
import {TCommonDialogProps} from "@core/main/types";

export type TProductDialogProps = TCommonDialogProps & {
    product?: ProductModel
}

export abstract class ProductDialogStore extends DialogStore<TProductDialogProps> {
    constructor() {
        super()
        makeObservable(this)
    }

    @action
    showProduct(product: ProductModel) {
        this.show({
            product: product
        })
    }

    abstract getType(): 'primary' | 'secondary'
}

export default ProductDialogStore

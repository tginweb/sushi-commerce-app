import ProductDialogStore from "./product-dialog";

export class ProductPrimaryDialogStore extends ProductDialogStore {
    getType(): 'primary' {
        return 'primary'
    }
}

export default ProductPrimaryDialogStore

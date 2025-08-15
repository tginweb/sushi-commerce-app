import ProductDialogStore from "./product-dialog";

export class ProductSecondaryDialogStore extends ProductDialogStore {
    getType(): 'secondary' {
        return 'secondary'
    }
}

export default ProductSecondaryDialogStore

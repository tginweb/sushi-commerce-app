import React from "react"
import {observer} from "mobx-react"
import {useStores} from "~stores"
import {useProductDialog} from "~com/catalog/dialog/product/hooks";

type TProps = {}

export const ProductPrimaryDialog: React.FC<TProps> = observer(({}) => {
    const {productPrimaryDialog} = useStores()
    return useProductDialog('primary', productPrimaryDialog)
});

export default ProductPrimaryDialog


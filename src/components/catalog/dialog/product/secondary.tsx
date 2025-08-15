import React from "react"
import {observer} from "mobx-react"
import {useStores} from "~stores"
import {useProductDialog} from "~com/catalog/dialog/product/hooks";

type TProps = {}

export const ProductSecondaryDialog: React.FC<TProps> = observer(({}) => {
    const {productSecondaryDialog} = useStores()
    return useProductDialog('secondary', productSecondaryDialog)
});

export default ProductSecondaryDialog


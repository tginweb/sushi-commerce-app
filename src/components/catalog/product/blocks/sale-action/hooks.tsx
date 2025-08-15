import {COLORS} from "~assets/design";
import {UiBtn} from "~ui/btn";
import React, {useMemo} from "react";
import {useStores} from "~stores";
import {ProductModel} from "@core/catalog/model/Product";
import icons from "~assets/icons-map";
import {QuantityInput} from "~com/sale/quantity-input";


type TUseProductSaleProps = {
    label?: string
    validateAdd?: any
    entity: ProductModel
    basketProps: any
}

export function useProductSale(props: TUseProductSaleProps) {

    const {vorder} = useStores()

    const {
        label,
        validateAdd,
        entity,
        basketProps
    } = props

    const calc = useMemo(() => {
        return vorder.calculateProduct(entity)
    }, [vorder.discountBestHash])

    const onBasketAdd = async () => {
        if (!validateAdd || validateAdd() !== false) {
            vorder.basketOp({
                action: 'add',
                productId: entity.ID,
                quantity: 1,
                product: entity,
                props: basketProps
            })
        }
    }

    const onQuantityChange = (value: number) => {
        vorder.basketOp({
            action: 'quantity',
            productId: entity.ID,
            quantity: value,
        })
    }

    const renderBasketAdd = () => <UiBtn
        label={typeof label !== 'undefined' ? label : '+ '}
        outline={true}
        color={COLORS.primary}
        size={'medium'}
        iconSize={20}
        onPress={onBasketAdd}
        iconOnRight={true}
        icon={icons.buy}
        avoidMinWidth={true}
        labelStyle={{fontSize: 22, lineHeight: 25}}
    />

    const renderBasketQuantity = () => basketItem &&
        <QuantityInput value={basketItem.QUANTITY} onChange={onQuantityChange}/>

    const showQuantity = true

    const basketItem = vorder.basketItemByProductId ? vorder.basketItemByProductId[entity.ID] : null

    const showAdd = !basketItem || !showQuantity

    return {
        renderBasketAdd,
        renderBasketQuantity,
        calc,
        basketItem,
        showAdd
    }
}

import React from "react"
import {StyleSheet} from "react-native"
import {Text, View, ViewProps} from "react-native-ui-lib";
import {ProductModel} from "@core/catalog/model/Product";
import {useServices} from "~services";
import {TProductCalculation} from "@core/catalog/types";

type TProps = ViewProps & {
    entity: ProductModel
    calc: TProductCalculation
    priceModifiers?: any
    oldPriceModifiers?: any
    withSpace?: boolean
    oldPriceSpaces?: number | boolean
    weightModifiers?: any
    showWeight?: boolean
    showWeightIfNoOldPrice?: boolean
    showOldPrice?: boolean
}

export const ProductPrice: React.FC<TProps> = (props) => {

    const {catalogUtil} = useServices()

    const {
        entity,
        calc,
        priceModifiers,
        oldPriceModifiers,
        oldPriceSpaces = 1,
        weightModifiers,
        withSpace = false,
        showWeight = true,
        showWeightIfNoOldPrice,
        showOldPrice = true,
        ...rest
    } = props

    const price = calc.priceDiscounted

    const oldPrice = calc.discountPercent ? entity.price : 0

    const oldPriceVisible = showOldPrice && !!oldPrice

    return <View
        row
        {...rest}
    >
        <Text
            {...(priceModifiers || {
                'text-lg-m-lh0': true
            })}
        >
            {catalogUtil.formatPriceCurrency(price, withSpace)}
        </Text>

        {
            oldPriceVisible &&
            <Text
                {...(oldPriceModifiers || {
                    'text-sm-lh0': true
                })}
                style={styles.oldPrice}
            >
                {catalogUtil.formatPriceCurrency(oldPrice, withSpace, true, oldPriceSpaces)}
            </Text>
        }
        {
            showWeight && (!showWeightIfNoOldPrice || !oldPriceVisible) && !!entity.weight &&
            <Text
                {...(weightModifiers || {
                    'text-xs-m-lh0': true,
                    'grey30': true
                })}
            >
                / {entity.weight} гр
            </Text>
        }
    </View>
}

const styles = StyleSheet.create({
    price: {},
    oldPrice: {
        marginLeft: 3,
        textDecorationLine: 'line-through',
        color: '#d33b3b'
    },
})


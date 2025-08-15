import React from "react"
import {Text, View, ViewProps} from "react-native-ui-lib"
import {StyleSheet} from "react-native"
import {useServices} from "~services";

export type UiPriceProps = ViewProps & {
    price: number,
    priceModifiers?: any,
    priceBase?: number,
    priceBaseModifiers?: any,
    priceBaseSpaces?: number
}

export const UiPrice: React.FC<UiPriceProps> = (props) => {

    const {
        price,
        priceBase,
        priceModifiers,
        priceBaseModifiers,
        priceBaseSpaces = 1,
        ...rest
    } = props

    if (!price)
        return null;

    const {catalogUtil} = useServices()

    return <View
        row
        {...rest}
    >

        {
            !!priceBase && priceBase !== price && <Text
                {...(priceBaseModifiers || {
                    'text-sm-m-lh0': true
                })}
                style={styles.priceBase}
            >
                {catalogUtil.formatPriceCurrency(priceBase, false, true, priceBaseSpaces)}
            </Text>
        }

        <Text
            {...(priceModifiers || {
                'text-md-m-lh0': true
            })}
        >
            {catalogUtil.formatPriceCurrency(price, false)}
        </Text>

    </View>
}

const styles = StyleSheet.create({
    price: {},
    priceBase: {
        fontWeight: '500',
        marginLeft: 4,
        textDecorationLine: 'line-through',
        //textDecorationColor: '#000000',
        color: '#d33b3b',
    },
})

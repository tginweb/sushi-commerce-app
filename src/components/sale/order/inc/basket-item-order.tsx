import React, {useCallback} from "react"

import {Text, TouchableOpacity, View, ViewProps} from "react-native-ui-lib"
import {StyleSheet} from "react-native"
import {useStores} from "~stores"
import {observer} from "mobx-react"
import {BasketItemModel} from "@core/sale/model/BasketItem"
import {UiImage} from "~ui/image"

type TProps = ViewProps & {
    basketItem: BasketItemModel
    onPress?: () => void
}

export const BasketItemOrder: React.FC<TProps> = observer((props) => {

    const {
        basketItem,
        onPress,
        ...rest
    } = props

    const {catalog} = useStores()

    const _onPress = useCallback(() => {
        onPress ? onPress() : catalog.showProduct(basketItem.PRODUCT_ID)
    }, [onPress])

    return (
        <TouchableOpacity
            row
            centerV
            onPress={_onPress}
            style={{
                gap: 10
            }}
            {...rest}
        >
            <View flex-3>
                {basketItem?.product?.listImage?.SRC && (
                    <UiImage
                        source={{uri: basketItem.product.imageSrcRequired}}
                        contentFit={'contain'}
                        vendor={'expo'}
                        style={{
                            resizeMode: 'contain',
                            width: '100%',
                            aspectRatio: 1.3,
                        }}
                    />
                )}
            </View>
            <View flex-8>
                <Text text-sm-lh1>
                    {basketItem.NAME}
                </Text>
            </View>
            <View flex-2>
                <Text bold bold-8 primary font-size-md> x{basketItem.QUANTITY}</Text>
            </View>
            <View flex-3 right>
                <Text bold right font-size-md>{basketItem.PRICE_BASE} ₽</Text>
            </View>
        </TouchableOpacity>
    )
})

const styles = StyleSheet.create({
    container: {
        borderRadius: 20,
        overflow: "hidden",
        backgroundColor: '#FFFFFF'
    },
});

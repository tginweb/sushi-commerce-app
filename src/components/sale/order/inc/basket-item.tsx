import React, {useState} from "react"

import {Text, View} from "react-native-ui-lib"
import {StyleSheet} from "react-native"
import {useStores} from "~stores"
import {observer} from "mobx-react"
import {useServices} from "~services"
import {UiImage} from "~ui/image"
import {BasketItemModel} from "@core/sale/model/BasketItem";
import {COLORS} from "~assets/design";
import icons from "~assets/icons-map";
import {UiBtn} from "~ui/btn";
import {UiBadge} from "~ui/badge";

type TProps = {
    model: BasketItemModel
}

export const BasketItem: React.FC<TProps> = observer((props) => {

    const {sale, vorder} = useStores();
    const {imager} = useServices();

    const {
        model,
        ...rest
    } = props

    const basketItem = vorder.basketItemByProductId[model.PRODUCT_ID]

    const [basketInputProps, setBasketInputProps] = useState<any>({
        GIFT: null,
    })

    const [basketProps, setBasketProps] = useState<any>({
        GIFT: null,
    })

    const onBasketAdd = (value: number) => {
        vorder.basketOp({
            action: 'add',
            productId: model.PRODUCT_ID,
            quantity: 1,
            product: model.product,
            inputProps: basketInputProps,
            props: basketProps
        })
    }

    const onBasketQuantity = (value: number) => {
        vorder.basketOp({
            action: 'quantity',
            basketId: model.ID,
            productId: model.PRODUCT_ID,
            quantity: value
        })
    }

    return (
        <View row gap-6 centerV>
            <View flex-6>
                {model.imageSrc && <UiImage
                    source={{uri: model.imageSrc}}
                    contentFit={'contain'}
                    vendor={'expo'}
                    style={{
                        resizeMode: 'contain',
                        width: '100%',
                        height: 45,
                    }}
                />}
            </View>
            <View flex-14 gap-6>
                <Text text-md-lh2>{model.name}</Text>
                {model.filling && <Text text-sm-lh1 grey20>{model.filling}</Text>}
            </View>
            <View flex-6 gap-2>
                <Text text-sm-lh0>{model.PRICE_BASE} ₽</Text>
                <Text primary text-sm-m-lh0>x {model.QUANTITY}</Text>
            </View>
            <View flex-4 right>
                {!!basketItem &&
                    <UiBadge
                        label={basketItem.QUANTITY.toString()}
                        size={20}
                        containerStyle={styles.badge}
                        backgroundColor={COLORS.primary}
                    />
                }
                {
                    model.canBy && <UiBtn
                        outline={true}
                        round={true}
                        color={COLORS.primary}
                        iconSize={18}
                        diameter={37}
                        onPress={onBasketAdd}
                        icon={icons.buy}
                    />
                }
            </View>
        </View>
    )
})

const styles = StyleSheet.create({
    badge: {
        position: "absolute",
        top: -10,
        right: -6,
        zIndex: 100
    }
});

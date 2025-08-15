import React from "react"

import {Text, TouchableOpacity, View} from "react-native-ui-lib"
import {StyleSheet} from "react-native"
import {useStores} from "~stores"
import {observer} from "mobx-react"
import {useServices} from "~services"
import {OrderModel} from "@core/sale/model/Order"
import {BasketItem} from "./inc/basket-item"
import {BasketItemModel} from "@core/sale/model/BasketItem";
import {UiBtn} from "~ui/btn";
import {COLORS} from "~assets/design";

type TProps = {
    order: OrderModel;
}

export const OrderViewHistory: React.FC<TProps> = observer(({order}) => {

    const {catalog, vorder} = useStores()
    const {} = useServices()

    const onOpenProduct = (item: BasketItemModel) => {
        const productModel = catalog.productById[item.PRODUCT_ID]
        if (productModel)
            catalog.showProduct(productModel)
    }

    return (
        <View paddingH-16 paddingV-16 bg-white br-md style={styles.container}>
            <View row gap-10 centerV>
                <View flexG>
                    <Text text-md-m>Заказ № {order.ACCOUNT_NUMBER}</Text>
                </View>
                <View flexS right>
                    <Text text-md-m style={{
                        color: order.CSTATUS_COLOR
                    }}>{order.CSTATUS_NAME}</Text>
                </View>
            </View>
            <View marginT-10>
                <Text grey40>
                    <Text text-md>{order.deliveryDateTime}</Text>
                </Text>
            </View>
            <View marginT-20 gap-13>
                {order.BASKET.map((item) =>
                    <TouchableOpacity
                        key={item.ID}
                        onPress={() => onOpenProduct(item)}
                    >
                        <BasketItem
                            model={item}
                        />
                    </TouchableOpacity>
                )}
            </View>
            <View marginT-15>
                <UiBtn
                    label={'Повторить весь заказ'}
                    onPress={() => vorder.basketAddOrder(order)}
                    outline={true}
                    color={COLORS.primary}
                />
            </View>
        </View>
    )
})

const styles = StyleSheet.create({
    container: {
        borderRadius: 12,
        overflow: "hidden",
    },
});

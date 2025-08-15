import React from "react"
import {Text, TouchableOpacity, View, ViewProps} from "react-native-ui-lib"
import {StyleSheet} from "react-native"
import {QuantityInput} from "~com/sale/quantity-input"
import {useStores} from "~stores"
import {observer} from "mobx-react"
import {useServices} from "~services"
import {THEME, TYPOGRAPHY} from "~assets/design"
import {TBasketItemCalculated} from "@core/sale/types";
import {UiImage} from "~ui/image";
import {moderateScale} from "@core/main/lib/scale";

type TProps = ViewProps & {
    item: TBasketItemCalculated
    last?: boolean
    first?: boolean
    showDiscount?: boolean
    showImage?: boolean
    readonly?: boolean
};

export const BasketItem: React.FC<TProps> = observer((props) => {

    //return <View style={{height: 50}}></View>
    const {
        item,
        last = false,
        first = false,
        style,
        showDiscount = false,
        showImage = true,
        readonly,
        ...rest
    } = props

    const {
        model,
        calc
    } = item

    const {vorder, catalog, debug} = useStores();
    const {imager, catalogUtil} = useServices();

    const methods = {
        onQuantityChange: (value: number) => {
            vorder.basketOp({
                action: 'quantity',
                basketId: model.ID,
                productId: model.PRODUCT_ID,
                quantity: value
            })
        },
        onDelete: () => {
            vorder.basketDelete({
                action: 'delete',
                basketId: model.ID,
                productId: model.PRODUCT_ID
            })
        },
        onView: () => {
            if (model.product)
                catalog.showProduct(model.product)
        }
    }

    const quantityBtnSize = moderateScale(35, 1.6)

    return (
        <View
            centerV
            row
            gap-6
            {...rest}
            style={[
                styles.item,
                style,
                last && {borderBottomWidth: 0},
                first && {paddingTop: 0}
            ]}
        >
            {showImage && <TouchableOpacity
                flex-6
                onPress={methods.onView}
            >
                {model.imageSrc && <UiImage
                    source={{uri: model.imageSrc}}
                    contentFit={'contain'}
                    vendor={'expo'}
                    style={{
                        resizeMode: 'contain',
                        width: '100%',
                        aspectRatio: 1.3,
                    }}
                />}
            </TouchableOpacity>}

            <TouchableOpacity
                flex-20
                onPress={methods.onView}
                onLongPress={() => debug.dump('Basket item', item)}
            >
                <View>

                    <Text text-sm-m-lh2>{model.name}</Text>

                    {model.propValue.GIFT && (
                        <View row gap-6 centerV marginT-3>
                            <Text text-sm-lh0 primary>+ подарок {"\n"} {model.propValue.GIFT?.NAME}</Text>
                            <UiImage
                                source={{uri: model.propValue.GIFT.IMAGE?.SRC}}
                                contentFit={'cover'}
                                height={33}
                                width={20}
                                style={{marginLeft: 3}}
                            />
                        </View>
                    )}

                    {!!model.filling && <Text text-sm-lh1>{model.filling}</Text>}

                    {
                        showDiscount && calc.discountPercent ?
                            <View row gap-6 marginT-5>
                                <Text style={styles.price}>
                                    {catalogUtil.formatPriceCurrency(calc.priceTotalDiscounted)}
                                </Text>
                                <Text style={styles.priceOld}>
                                    {catalogUtil.formatPriceCurrency(model.finalPriceBase, true, true, 1)}
                                </Text>
                            </View>
                            :
                            <View marginT-5>
                                <Text style={styles.price}>
                                    {catalogUtil.formatPriceCurrency(calc.priceTotalDiscounted)}
                                </Text>
                            </View>
                    }
                </View>

            </TouchableOpacity>

            <View flex-9 right centerV>
                {!readonly ?
                    <QuantityInput
                        value={model.QUANTITY}
                        onChange={methods.onQuantityChange}
                        size={quantityBtnSize}
                    />
                    :
                    <Text text-lg-bo>
                        x {model.QUANTITY}
                    </Text>
                }
            </View>
        </View>
    )
})

const styles = StyleSheet.create({
    item: {
        borderBottomWidth: 1,
        borderTopColor: THEME.separatorColor,
        borderBottomColor: THEME.separatorColor,
    },
    price: {
        ...TYPOGRAPHY["text-xs-lh0"],
    },
    priceOld: {
        color: '#d33b3b',
        ...TYPOGRAPHY["text-xxs-lh0"],
        textDecorationLine: 'line-through',
    },
    itemLast: {
        borderBottomWidth: 0
    },
});

import React from "react"
import {StyleSheet} from "react-native"
import {useServices} from "~services"

import {COLORS, TYPOGRAPHY} from "~assets/design"
import {Text, View} from "react-native-ui-lib"
import {TProductCardProps} from "./card.types"
import {useProduct, useProductSale} from "./card.hooks"
import {ProductImage} from "~com/catalog/product/blocks/image";
import icons from "~assets/icons-map";
import {TouchableWithoutFeedback} from "react-native-gesture-handler";
import {CardPressable} from "../card-pressable";

const ProductCardSlideMiniComponent: React.FC<TProductCardProps> = (props) => {

    const {catalogUtil} = useServices()

    const {
        entity,
        style,
        showTopbar = true,
        onPressBehavior = 'product',
        onPress,
        hideSale = false,
        titleNumberOfLines = 2,
        descNumberOfLines = 2,
        descriptionHide,
    } = props

    const {
        onBasketAdd,
        onBasketQuantity,
        openProduct,
    } = useProduct(props)

    const {
        calc,
    } = useProductSale({
        entity,
        onBasketAdd,
        onBasketQuantity,
    })

    return (
        <CardPressable
            shouldCancelWhenOutside={true}
            rippleColor={'#FFFFFF'}
            onPress={openProduct}
            style={[styles.wrapper, style]}
        >
            <View
                gap-6
                style={[styles.container]}
                row
                centerV
                paddingH-7
                paddingV-7
            >
                <View flex-4 gap-4 style={styles.media}>
                    <ProductImage
                        entity={entity}
                        imageSize={40}
                        style={styles.img}
                    />
                </View>
                <View flex-15 gap-1 style={styles.info}>
                    <View row>
                        <Text style={styles.productName} text-xxs-m-lh0 numberOfLines={titleNumberOfLines}>
                            {entity.NAME}
                        </Text>
                    </View>
                    {!descriptionHide &&
                        <Text style={styles.productDescription} grey30 numberOfLines={descNumberOfLines}>
                            {entity.previewTextFormatted}
                        </Text>
                    }
                </View>

                {
                    !hideSale && <View style={{width: 48}}>
                        <TouchableWithoutFeedback onPress={onBasketAdd}>
                            <View
                                gap-3
                                paddingV-4
                                center
                                style={{borderWidth: 1, borderRadius: 17, borderColor: COLORS.primary}}
                            >
                                {icons.buy({
                                    color: COLORS.primary,
                                    size: 13
                                })}
                                <Text
                                    primary
                                    text-3xs-bo-lh0
                                >
                                    {catalogUtil.formatPriceCurrency(calc.priceDiscounted, true)}
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                }
            </View>
        </CardPressable>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flexGrow: 1
    },
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        shadowColor: "#777777",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 4,
    },
    productName: {
        flex: 1,
        flexWrap: 'wrap'
    },
    productDescription: {
        ...TYPOGRAPHY['text-4xs-lh1']
    },
    media: {
        position: 'relative',
        //borderWidth: 1
    },
    info: {
        //borderWidth: 1
    },
    img: {
        resizeMode: 'contain',
        width: '100%',
        height: 40,
    },
    topBar: {
        zIndex: 10
    },
})

export const ProductCardSlideMini = React.memo(ProductCardSlideMiniComponent, (prevProps, newProps) => {
    return prevProps.entity.ID === newProps.entity.ID
})

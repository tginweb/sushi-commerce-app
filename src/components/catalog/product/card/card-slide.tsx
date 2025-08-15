import React from "react"
import {StyleSheet} from "react-native"

import {wHeight} from "~assets/design"
import {Text, View} from "react-native-ui-lib"
import {TProductCardProps, TProductCardSaleProps} from "./card.types"
import {useProduct, useProductSale} from "./card.hooks"
import {observer} from "mobx-react";
import {ProductFlags} from "~com/catalog/product/blocks/flags";
import {ProductImage} from "~com/catalog/product/blocks/image";
import {ProductPrice} from "~com/catalog/product/blocks/price";
import {ProductRequiredPrice} from "~com/catalog/product/blocks/required-price";
import {ProductFav} from "~com/catalog/product/blocks/fav";
import {CardPressable} from "../card-pressable";

const SaleAction: React.FC<TProductCardSaleProps> = observer((props) => {

    const {
        entity,
        onBasketAdd,
        onBasketQuantity,
        ...rest
    } = props

    const {
        renderBasketAdd,
        renderBasketQuantity,
        calc,
        showAdd,
    } = useProductSale({
        entity,
        onBasketAdd,
        onBasketQuantity,
    })

    return showAdd ?
        <View paddingH-10 row gap-15 centerV centerH {...rest}>
            <ProductPrice
                calc={calc}
                entity={entity}
                showWeight={false}
                showOldPrice={true}
                oldPriceModifiers={{
                    'text-3xs-m-lh0': true
                } as any}
                priceModifiers={{
                    'text-sm-m-lh0': true
                } as any}
                oldPriceSpaces={0}
                row
                gap-0
            />
            <View>
                {renderBasketAdd({outline: true, size: 36})}
            </View>
        </View>
        :
        <View row centerV centerH paddingH-30 {...rest}>
            {renderBasketQuantity({size: 36})}
        </View>
})

const ProductCardSlideComponent: React.FC<TProductCardProps> = (props) => {

    const {
        entity,
        style,
        showTopbar = true,
        excludeFlags,
        hideSale,
        onLayout
    } = props

    const {
        onBasketAdd,
        onBasketQuantity,
        openProduct,
        flags,
        favItem
    } = useProduct(props)

    const showFav = !(excludeFlags || []).includes('fav')

    return (
        <CardPressable
            shouldCancelWhenOutside={true}
            rippleColor={'#FFFFFF'}
            onPress={openProduct}
            style={[styles.wrapper, style]}
        >
            <View paddingB-10 paddingT-10 gap-5 style={[styles.container]} onLayout={onLayout}>

                <View flexG>

                    <View style={styles.media}>

                        {showTopbar && <>
                            <ProductFlags
                                dense row gap-4 absT absL marginL-6 marginT-5
                                style={styles.topBarBlock}
                                flags={flags}
                            />
                            {showFav && <ProductFav
                                active={!!favItem}
                                paddingR-6
                                absT absR
                                marginR-6 marginT-5
                                style={styles.topBarBlock}
                            />}
                        </>}

                        <ProductImage
                            entity={entity}
                            imageSize={200}
                            style={styles.img}
                        />
                    </View>
                    <View style={styles.info} paddingH-5 gap-6>
                        <View row>
                            <Text style={styles.productName} center text-sm-m-lh1>
                                {entity.NAME}
                            </Text>
                        </View>
                    </View>
                </View>

                {!hideSale &&
                    <>
                        <SaleAction
                            entity={entity}
                            onBasketAdd={onBasketAdd}
                            onBasketQuantity={onBasketQuantity}
                            style={{marginTop: 'auto'}}
                        />
                        <ProductRequiredPrice
                            entity={entity}
                            marginH-12
                            marginT-6
                            center
                        />
                    </>
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
        flexDirection: 'column',
        // flexGrow1: 1,

        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        shadowColor: "#777777",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 4
    },
    productName: {
        flex: 1,
        flexWrap: 'wrap'
    },
    productDescription: {
        flex: 1,
        flexWrap: 'wrap',
    },
    media: {
        position: 'relative'
    },
    info: {},
    img: {
        resizeMode: 'contain',
        width: '100%',
        height: wHeight / 7,
    },
    topBarBlock: {
        zIndex: 10,
    },
})

export const ProductCardSlide = React.memo(ProductCardSlideComponent, (prevProps, newProps) => {
    return prevProps.entity.ID === newProps.entity.ID
})


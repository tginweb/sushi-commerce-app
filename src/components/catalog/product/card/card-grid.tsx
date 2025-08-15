import React from "react"
import {StyleSheet} from "react-native"

import {COLORS, wHeight} from "~assets/design"
import {Text, View} from "react-native-ui-lib"
import {TProductCardProps, TProductCardSaleProps} from "./card.types"
import {useProduct, useProductSale} from "./card.hooks"
import {observer} from "mobx-react";
import {ProductFlags} from "~com/catalog/product/blocks/flags";
import {ProductImage} from "~com/catalog/product/blocks/image";
import {ProductGiftsCompact} from "~com/catalog/product/blocks/gifts-compact";
import icons from "~assets/icons-map";
import {ProductBuild} from "~com/catalog/product/blocks/build";
import {ProductPrice} from "~com/catalog/product/blocks/price";
import {ProductFav} from "~com/catalog/product/blocks/fav";
import {CardPressable} from "../card-pressable";

const SaleAction: React.FC<TProductCardSaleProps> = observer((props) => {

    const {
        entity,
        onBasketAdd,
        onBasketQuantity,
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

        <View row centerH>
            <View row gap-10 centerV>
                <ProductPrice
                    calc={calc}
                    entity={entity}
                    showOldPrice={showAdd}
                    showWeight={true}
                    showWeightIfNoOldPrice={true}
                    oldPriceSpaces={false}
                    priceModifiers={{
                        'text-sm-m-lh0': true
                    }}
                    oldPriceModifiers={{
                        'text-xxs-r-lh0': true
                    }}
                    weightModifiers={{
                        'text-sm-r-lh1': true,
                        'grey30': true,
                    }}
                    row
                    gap-4
                />
                <View style={{marginLeft: 'auto'}}>
                    {renderBasketAdd({})}
                </View>
            </View>
        </View>
        :
        <View row centerV centerH paddingH-30>
            {renderBasketQuantity()}
        </View>
})

const ProductCardGridComponent: React.FC<TProductCardProps> = (props) => {

    const {
        entity,
        style,
        containerStyle,
        containerShadow = true,
        hideSale = false,
        onLayout
    } = props

    const {
        basketInputProps,
        onBasketAdd,
        onBasketQuantity,
        onGiftSelect,
        giftsDialogRendered,
        openProduct,
        flags,
        favItem
    } = useProduct(props)

    return <CardPressable
        onPress={openProduct}
        style={[
            styles.wrapper,
            style
        ]}
        shouldCancelWhenOutside={true}
        rippleColor={'#FFFFFF'}
    >
        {giftsDialogRendered}

        <View
            paddingV-10
            style={[
                styles.container,
                containerShadow && styles.containerShadow,
                containerStyle
            ]}
            onLayout={onLayout}
        >
            <View flexG>
                <View style={styles.media}>
                    <ProductFlags
                        dense row gap-4 absT absL marginL-10
                        flags={flags}
                        style={styles.topBarBlock}
                    />
                    <ProductFav
                        absT absR marginR-10
                        active={!!favItem}
                        style={styles.topBarBlock}
                    />
                    <ProductImage
                        entity={entity}
                        imageSize={150}
                        style={styles.img}
                    />
                </View>


                <View style={styles.info} paddingH-5 gap-6>
                    <Text center text-md-bo-lh1 style={[styles.productName]}>
                        {entity.nameCleaned}
                    </Text>
                    {entity.previewTextFormatted && <Text
                        style={styles.productDescription}
                        center
                        text-sm-lh1
                        grey30
                        numberOfLines={4}
                        marginH-5
                    >
                        {entity.previewTextFormatted}
                    </Text>}
                </View>

                <ProductBuild
                    entity={entity}
                    marginH-13
                    marginV-8
                />

            </View>
            <View gap-8>

                <ProductGiftsCompact
                    basketInputProps={basketInputProps}
                    entity={entity}
                    onSelect={(id, gift) => onGiftSelect(gift)}
                    label={null}
                    paddingH-3
                    paddingV-5
                    showLabel={false}
                    prepend={<View paddingL-7 centerH gap-3>
                        {
                            icons.gift({size: 13, color: COLORS.primaryLighter})
                        }
                        <Text text-4xs-m-lh0 primary>
                            подарок
                        </Text>
                    </View>
                    }
                />

                {!hideSale && <SaleAction
                    entity={entity}
                    onBasketAdd={onBasketAdd}
                    onBasketQuantity={onBasketQuantity}
                    paddingH-6
                />}
            </View>
        </View>
    </CardPressable>
}

const styles = StyleSheet.create({
    containerShadow: {
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
    wrapper: {
        flexGrow: 1
    },
    container: {
        gap: 5,
        flex: 1,
        flexDirection: 'column',
        // flexGrow1: 1,
        backgroundColor: '#FFFFFF',
    },
    productName: {
        //flex: 1,
        flexWrap: 'wrap'
    },
    productDescription: {
        //flex: 1,
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

export const ProductCardGrid = React.memo(ProductCardGridComponent, (prevProps, newProps) => {
    return prevProps.entity.ID === newProps.entity.ID
})


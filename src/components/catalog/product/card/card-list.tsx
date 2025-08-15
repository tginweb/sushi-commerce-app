import React from "react"
import {StyleSheet} from "react-native"
import {useStores} from "~stores"

import {COLORS, wWidth} from "~assets/design"
import {Text, View} from "react-native-ui-lib"
import {ProductSostavList} from "../blocks/sostav-list"
import {TProductCardProps, TProductCardSaleProps} from "./card.types"
import {useProduct, useProductSale} from "./card.hooks"
import icons from "~assets/icons-map";
import {observer} from "mobx-react";
import {ProductFlags} from "~com/catalog/product/blocks/flags";
import {ProductImage} from "~com/catalog/product/blocks/image";
import {ProductPrice} from "~com/catalog/product/blocks/price";
import {ProductRequiredPrice} from "~com/catalog/product/blocks/required-price";
import {ProductErrors} from "~com/catalog/product/blocks/errors";
import {ProductBuild} from "~com/catalog/product/blocks/build";
import {ProductGiftsCompact} from "~com/catalog/product/blocks/gifts-compact";
import {ProductFav} from "~com/catalog/product/blocks/fav";
import {CardPressable} from "../card-pressable";

const SaleAction: React.FC<TProductCardSaleProps> = observer((props) => {

    const {
        entity,
        onBasketAdd,
        onBasketQuantity,
    } = props

    const {
        showAdd,
        renderBasketAdd,
        renderBasketQuantity,
        calc,
    } = useProductSale({
        entity,
        onBasketAdd,
        onBasketQuantity,
    })

    return <View row flexG centerV>
        <ProductPrice
            calc={calc}
            entity={entity}
            showWeight={true}
            oldPriceSpaces={false}
            priceModifiers={{
                'text-md-m-lh0': true
            }}
            oldPriceModifiers={{
                'text-xxs-r-lh0': true
            }}
            weightModifiers={{
                'text-sm-m-lh0': true,
                'grey30': true
            }}
            showOldPrice={showAdd}
            flexG
            row
            gap-4
        />
        <View>
            {showAdd ? renderBasketAdd() : renderBasketQuantity()}
        </View>
    </View>
})

const ProductCardListComponent: React.FC<TProductCardProps> = (props) => {

    const {catalog, debug} = useStores()

    //console.log('RENDER product', props.entity.NAME)

    const {
        entity,
        style,
        excludeFlags,
        ...rest
    } = props

    const {
        basketInputProps,
        onBasketAdd,
        onBasketQuantity,
        onGiftSelect,
        error,
        errorSafe,
        openProduct,
        flags,
        favItem
    } = useProduct(props)

    //console.log("PRODUCT " + entity.ID)

    return (
        <CardPressable
            onPress={openProduct}
            style={[styles.wrapper, style]}
            shouldCancelWhenOutside={true}
            rippleColor={'#FFFFFF'}
            onLongPress={() => {
                debug.dump('card', {entity})
            }}
        >
            <View row paddingV-16 paddingL-3 paddingR-11 style={[styles.container]} {...rest}>
                <View flex-7 style={styles.media}>
                    <ProductFlags
                        row gap-4 dense absT absL paddingL-6 marginT-3
                        flags={flags}
                        style={styles.topBarBlock}
                    />
                    {flags.length < 2 && <ProductFav
                        absT absR paddingR-6 marginT-3
                        active={!!favItem}
                        style={styles.topBarBlock}
                    />}
                    <ProductImage
                        entity={entity}
                        imageSize={130}
                        style={styles.img}
                    />
                </View>
                <View flex-17 flex gap-3 style={styles.info}>
                    <View >
                        <Text wrap text-lg-bo-lh2>
                            {entity.nameCleaned}
                        </Text>
                        <Text wrap marginT-5 text-sm-lh1 grey30>
                            {entity.previewTextFormatted}
                        </Text>
                        <ProductSostavList
                            entity={entity}
                            limit={5}
                            marginT-8
                        />
                        <ProductBuild
                            entity={entity}
                            marginT-2
                        />
                        <ProductGiftsCompact
                            entity={entity}
                            basketInputProps={basketInputProps}
                            onSelect={(id, gift) => onGiftSelect(gift)}
                            label={null}
                            paddingH-3
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
                        <ProductRequiredPrice
                            entity={entity}
                            paddingH-12
                            marginT-8
                        />
                        <ProductErrors
                            entity={entity}
                            error={error}
                            errorSafe={errorSafe}
                            marginT-10
                        />
                    </View>
                    <SaleAction
                        entity={entity}
                        onBasketAdd={onBasketAdd}
                        onBasketQuantity={onBasketQuantity}
                    />
                </View>
            </View>
        </CardPressable>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flexGrow: 1,
        backgroundColor: '#FFFFFF',
        // paddingHorizontal: 10
    },
    container: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        shadowColor: "#777777",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 4,
        gap: 9,
    },
    img: {
        resizeMode: 'contain',
        width: '100%',
        height: wWidth / 3.3,
    },
    topBar: {
        zIndex: 10,
        width: '100%'
    },
    media: {
        position: 'relative'
    },
    info: {},
    topBarBlock: {
        zIndex: 10,
    },
})

export const ProductCardList = React.memo(ProductCardListComponent, (prevProps, newProps) => {
    return prevProps.entity.ID === newProps.entity.ID
})


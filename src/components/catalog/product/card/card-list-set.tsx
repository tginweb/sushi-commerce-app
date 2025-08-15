import React from "react"
import {StyleSheet} from "react-native"
import {useStores} from "~stores"
import {Text, View} from "react-native-ui-lib"
import {ProductSostavList} from "../blocks/sostav-list"
import {ProductGifts} from "../blocks/gifts"
import {TProductCardProps, TProductCardSaleProps} from "./card.types"
import {useProduct, useProductSale} from "./card.hooks"

import {observer} from "mobx-react";
import {ProductErrors} from "~com/catalog/product/blocks/errors";
import {ProductImage} from "~com/catalog/product/blocks/image";
import {ProductPrice} from "~com/catalog/product/blocks/price";
import {ProductFlags} from "~com/catalog/product/blocks/flags";
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
    return <View row flexG centerV {...rest}>
        <ProductPrice
            calc={calc}
            entity={entity}
            showWeight={false}
            withSpace={true}
            priceModifiers={{
                'text-md-bo-lh0': true
            }}
            oldPriceModifiers={{
                'text-xs-r-lh0': true
            }}
            flexG
            row
            gap-3
        />
        <View>
            {showAdd ? renderBasketAdd({}) : renderBasketQuantity({size: 37})}
        </View>
    </View>
})

const ProductCardListSetComponent: React.FC<TProductCardProps> = (props) => {

    const {catalog} = useStores()

    const {
        entity,
        excludeFlags,
        style,
        imageSize = 200,
        ...rest
    } = props


    const {
        basketInputProps,
        onBasketAdd,
        onBasketQuantity,
        onGiftSelect,
        error,
        errorSafe,
        giftsDialogRendered,
        openProduct,
        flags,
        favItem
    } = useProduct({
        ...props as any,
        giftsVisible: true
    })

    return (
        <CardPressable
            shouldCancelWhenOutside={true}
            rippleColor={'#FFFFFF'}
            onPress={openProduct}
            style={[styles.wrapper, style]}
        >
            <View
                paddingV-16
                style={[styles.container]}
                {...rest}
            >
                <View row gap-10 paddingH-10>
                    <View flex-15 style={{}}>
                        <ProductFlags
                            row gap-4 dense absT absL paddingL-6 marginT-3
                            flags={flags}
                            style={styles.topBarBlock}
                        />
                        <ProductFav
                            absT absR paddingR-6 marginT-3
                            active={!!favItem}
                            style={styles.topBarBlock}
                        />
                        <ProductImage
                            entity={entity}
                            imageSize={400}
                            style={styles.img}
                        />
                    </View>
                    <View flex-9 gap-10>
                        <Text wrap text-lg-bo-lh2>
                            {entity.nameCleaned}
                        </Text>
                        <Text wrap text-sm-lh1 grey20>
                            {entity.previewTextFormatted}
                        </Text>
                        <Text text-sm-bo-lh0 grey30>{entity.weight} г</Text>
                    </View>
                </View>
                <View gap-10 paddingH-16>
                    <ProductSostavList
                        entity={entity}
                        limit={6}
                    />
                    <ProductGifts
                        basketInputProps={basketInputProps}
                        entity={entity}
                        onSelect={(id, gift) => onGiftSelect(gift)}
                    />
                    <ProductErrors
                        entity={entity}
                        error={error}
                        errorSafe={errorSafe}
                    />
                </View>
                <SaleAction
                    entity={entity}
                    onBasketAdd={onBasketAdd}
                    onBasketQuantity={onBasketQuantity}
                    marginT-8
                    paddingH-16
                />
            </View>
            {giftsDialogRendered}
        </CardPressable>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flexGrow: 1
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
    },


    img: {
        resizeMode: 'contain',
        width: '100%',
        flex: 1,
        aspectRatio: 1.5,
        position: 'relative'
    },
    topBar: {
        zIndex: 10
    },
    topBarBlock: {
        zIndex: 10,
    },
})

export const ProductCardListSet = React.memo(ProductCardListSetComponent, (prevProps, newProps) => {
    return prevProps.entity.ID === newProps.entity.ID
})


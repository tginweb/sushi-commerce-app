import React from "react"
import {StyleSheet} from "react-native"
import {observer} from "mobx-react"
import {Text, View, ViewProps} from "react-native-ui-lib"
import {useStores} from "~stores";
import {COLORS, TYPOGRAPHY, wWidth} from "~assets/design";
import {CatalogProductsSlider} from "~com/catalog/list/prodcts-slider";
import {ProductCardSlideMini} from "~com/catalog/product/card/card-slide-mini";
import icons from "~assets/icons-map";

type TProps = ViewProps & {}

export const TabBasketPersonalGifts: React.FC<TProps> = observer((props) => {

    const {...rest} = props

    const {vorder, sale, catalog} = useStores()

    const giftProducts = sale.userClientCard ? sale.userClientCard.GIFTS : []
    const giftProduct = giftProducts[0]

    if (!giftProduct)
        return <></>

    return <View {...rest}>

        {giftProducts.length > 1 ?
            <CatalogProductsSlider
                prependSlot={<View center gap-5>
                    {
                        icons.gift({size: 20, color: COLORS.primaryLight})
                    }
                    <Text
                        center text-sm-lh1
                        style={{
                            ...TYPOGRAPHY["text-xxs"],
                            width: 70
                        }}
                    >
                        Выберите подарок:
                    </Text>
                </View>}
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingTop: 6,
                    paddingBottom: 6
                }}
                products={giftProducts}
                deps={vorder.attrValue['PERSONAL_GIFT']}
                renderItem={(product) => <ProductCardSlideMini
                    key={product.ID}
                    entity={product}
                    showTopbar={false}
                    visible={true}
                    hideSale={true}
                    descNumberOfLines={3}
                    onPress={(product) => {
                        if (vorder.attrValue['PERSONAL_GIFT'] === product.ID) {
                            catalog.showProduct(product)
                        } else {
                            vorder.setPropValue('PERSONAL_GIFT', product.ID)
                        }
                    }}
                    style={[
                        {
                            width: wWidth / 1.7,
                        },
                        vorder.attrValue['PERSONAL_GIFT'] === product.ID && styles.selectedGift
                    ]}
                />}
            />
            :
            <View row gap-10 centerV paddingH-10>
                <View center gap-5>
                    {
                        icons.gift({size: 20, color: COLORS.primaryLight})
                    }
                    <Text center text-sm-lh0 style={{width: 70}}>
                        Подарок:
                    </Text>
                </View>
                <View flexG>
                    <ProductCardSlideMini
                        key={giftProduct.ID}
                        entity={giftProduct}
                        showTopbar={false}
                        visible={true}
                        //descriptionHide={true}
                        hideSale={true}
                        descNumberOfLines={3}
                        style={styles.selectedGift}
                        onPress={(product) => {
                            vorder.setPropValue('PERSONAL_GIFT', product.ID)
                            catalog.showProduct(product)
                        }}
                    />
                </View>
            </View>
        }

    </View>

})

const styles = StyleSheet.create({

    selectedGift: {
        borderWidth: 1,
        borderColor: COLORS.primaryLighter,
        borderRadius: 13
    }
})

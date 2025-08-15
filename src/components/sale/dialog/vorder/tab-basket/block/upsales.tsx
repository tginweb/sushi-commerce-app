import React from "react"
import {StyleSheet} from "react-native"
import {observer} from "mobx-react"
import {Text, View, ViewProps} from "react-native-ui-lib"
import {useStores} from "~stores";
import {TYPOGRAPHY, wWidth} from "~assets/design";
import {CatalogProductsSlider} from "~com/catalog/list/prodcts-slider";
import {ProductCardSlideMini} from "~com/catalog/product/card/card-slide-mini";

type TProps = ViewProps & {}

export const TabBasketUpsales: React.FC<TProps> = observer((props) => {

    const {...rest} = props

    const {vorder, catalog} = useStores()

    const products = vorder.getUpSaleProducts({
        limit: 10
    })

    if (!products.length) return <></>

    return <View style={{backgroundColor: '#faf1ed'}} {...rest}>
        <CatalogProductsSlider
            contentContainerStyle={{
                paddingHorizontal: 16,
                paddingTop: 6,
                paddingBottom: 6
            }}
            products={products}
            renderItem={(product) => <ProductCardSlideMini
                key={product.ID}
                entity={product}
                showTopbar={false}
                visible={true}
                //onPressAddBasket={true}
                style={{width: wWidth / 1.5}}
            />}
            prependSlot={<Text
                center
                text-sm-m
                style={{
                    ...TYPOGRAPHY['text-3xs-lh1'],
                    width: 70,
                }}
            >
                Добавьте также
            </Text>}
        />
    </View>
})

const styles = StyleSheet.create({})

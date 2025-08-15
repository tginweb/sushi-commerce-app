import React, {useCallback} from "react"
import {StyleSheet} from "react-native"
import {ProductModel} from "@core/catalog/model/Product";
import {wWidth} from "~assets/design"
import {Text, View, ViewProps} from "react-native-ui-lib";
import {useStores} from "~stores";
import {CatalogProductsSlider} from "~com/catalog/list/prodcts-slider";
import {ProductCardSlideMini} from "~com/catalog/product/card/card-slide-mini";
import {observer} from "mobx-react";

type TProps = ViewProps & {
    entity: ProductModel
}

const ProductUpSaleComponent: React.FC<TProps> = (
    {
        entity,
        ...rest
    },
) => {

    const {catalog, vorder} = useStores()

    const section = catalog.sectionsById[entity.IBLOCK_SECTION_ID]

    const products = vorder.getUpSaleProducts({
        productsIds: entity.UPSALE_ELEMENTS,
        productsSections: section && section.propValue.UPSALE_SECTIONS ? section.propValue.UPSALE_SECTIONS : []
    })


    const renderItem = useCallback((product: ProductModel) => <ProductCardSlideMini
        key={product.ID}
        entity={product}
        showTopbar={false}
        visible={true}
        onPressBehavior={'product'}
        productOpenAllowSecondary={true}
        style={{width: wWidth / 1.5}}
    />, [])

    if (!products.length)
        return <></>

    return <View gap-6 {...rest}>
        <View paddingH-16>
            <Text text-sm-m>Рекомендуем также:</Text>
        </View>
        <CatalogProductsSlider
            contentContainerStyle={{
                paddingHorizontal: 16,
                paddingVertical: 5,
            }}
            style={{
                overflow: 'visible',
                borderWidth: 1,
                borderColor: '#FFFFFF'
            }}
            products={products}
            renderItem={renderItem}
        />
    </View>
}

const styles = StyleSheet.create({})

// @ts-ignore
export const ProductUpSale = observer(ProductUpSaleComponent)

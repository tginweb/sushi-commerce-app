import React, {useCallback, useMemo, useState} from "react"
import {LayoutChangeEvent, ScrollViewProps, StyleSheet, ViewStyle} from "react-native"
import {observer} from "mobx-react";
import {ProductModel} from "@core/catalog/model/Product";
import {View} from "react-native-ui-lib";
import {ProductCardSlide} from "~com/catalog/product/card/card-slide";
import {wWidth} from "~assets/design";
import {ScrollView} from "react-native-gesture-handler";
import {TProductCardProps} from "~com/catalog/product/card/card.types";

export type CatalogProductsSliderItemRender = (
    product: ProductModel,
    context: {
        onLayout: (event: LayoutChangeEvent) => void
    }
) => any

export type CatalogProductsSliderProps = ScrollViewProps & {
    products: ProductModel[]
    limit?: number
    renderItem?: CatalogProductsSliderItemRender
    prependSlot?: any
    deps?: any
    excludeFlags?: string[]
    cardProps?: Partial<TProductCardProps>
    autoHeight?: boolean
}

const CatalogProductsSliderComponent: React.FC<CatalogProductsSliderProps> = (props) => {

    const {
        products,
        renderItem,
        limit = 100,
        prependSlot,
        excludeFlags,
        cardProps,
        autoHeight = false,
        deps,
        style,
        ...rest
    } = props

    const renderItemDefault = useCallback<CatalogProductsSliderItemRender>((product: ProductModel, {onLayout}) => {
        return <ProductCardSlide
            key={product.ID}
            entity={product}
            excludeFlags={excludeFlags}
            style={{width: wWidth / 2.6}}
            onLayout={onLayout}
            {...cardProps}
        />
    }, [cardProps])

    const _renderItem = renderItem || renderItemDefault

    const [itemsMaxHeight, setItemsMaxHeight] = useState(0)

    const onItemLayout = useCallback((event: LayoutChangeEvent) => {
        if (autoHeight) {
            const itemHeight = event.nativeEvent.layout.height
            console.log('itemHeight', itemHeight)
            if (itemHeight && (itemsMaxHeight < itemHeight)) {
                setItemsMaxHeight(itemHeight)
            }
        }
    }, [autoHeight, itemsMaxHeight])

    const renderedItems = useMemo(() => {
        return products.slice(0, limit).map(product => _renderItem(product, {onLayout: onItemLayout}))
    }, [
        products,
        limit,
        _renderItem,
        onItemLayout,
        deps
    ])

    const computedStyle = useMemo(() => {
        const res: ViewStyle = {}
        if (autoHeight && itemsMaxHeight) {
            res.height = itemsMaxHeight
        }
        return res
    }, [itemsMaxHeight, autoHeight])

    return !!products.length && <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 4,
            paddingBottom: 8,
        }}
        style={[
            style,
            computedStyle
        ]}
        {...rest}
    >
        <View gap-12 row centerV>
            {prependSlot}
            {renderedItems}
        </View>
    </ScrollView>
}

const styles = StyleSheet.create({})

export const CatalogProductsSlider = observer(CatalogProductsSliderComponent)

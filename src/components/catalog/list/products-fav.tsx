import React, {useMemo} from "react"
import {StyleSheet} from "react-native"
import {useStores} from "~stores"
import {observer} from "mobx-react";
import {CatalogProducts, CatalogProductsProps} from "./products";
import {Text, View} from "react-native-ui-lib";
import icons from "~assets/icons-map";
import {COLORS} from "~assets/design";

export const CatalogProductsFavComponent: React.FC<Omit<CatalogProductsProps, 'elements'>> = (
    {
        tab,
        gridProps,
        ...rest
    }
) => {
    const {fav} = useStores()

    const emptyComponent = useMemo(() => {
        return <View marginT-20 paddingH-30 gap-10 centerH>
            <Text center text-md-m>Ваш список избранного пуст.</Text>
            <Text center>Добавляйте любимые блюда используя значок в карточках товаров:</Text>
            {icons.heart({size: 30, color: COLORS.red30})}
        </View>
    }, [])

    return <CatalogProducts
        productDeps={fav.hash}
        tab={tab}
        {...rest}
        elements={fav.products}
        viewMode={'grid'}
        emptyComponent={emptyComponent}
    />
}

const styles = StyleSheet.create({})

export const CatalogProductsFav = observer(CatalogProductsFavComponent)

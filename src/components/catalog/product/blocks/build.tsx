import React from "react"
import {StyleSheet, ViewStyle} from "react-native"
import {Text, View, ViewProps} from "react-native-ui-lib"
import {ProductModel} from "@core/catalog/model/Product"

type TProps = ViewProps & {
    containerStyle?: ViewStyle
    entity: ProductModel
}

export const ProductBuild: React.FC<TProps> = (
    {
        containerStyle = {},
        entity,
        ...rest
    }
) => {

    const items = entity.BUILD?.SOSTAV || []

    if (!items.length)
        return <></>

    return <View
        style={[styles.container, containerStyle]}
        {...rest}
    >
        {items.slice(1, items.length).map(item => <View gap-10 row key={item.ELEMENT?.ID}>
            <Text text-sm-lh1 key={item.ELEMENT?.ID} style={styles.label}>
                {item.ELEMENT?.NAME}
            </Text>
            {(item.QUANTITY || 1) > 1 && <Text text-sm-bo-lh1 marginL-auto> x{item.QUANTITY}</Text>}
        </View>)}
    </View>
}

const styles = StyleSheet.create({
    container: {
        gap: 7
    },
    containerExpanded: {
        gap: 10
    },
    label: {
        flex: 1,
        flexWrap: 'wrap'
    },

})


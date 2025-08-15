import React, {useState} from "react"
import {StyleSheet} from "react-native"
import {Colors, Text, TouchableOpacity, View} from "react-native-ui-lib"
import {ProductModel} from "@core/catalog/model/Product"

type TProps = {
    entity: ProductModel
    limit?: number
    expandable?: boolean
    expanded?: boolean
}

export const ProductSostavList: React.FC<TProps> = (props) => {

    const {
        entity,
        limit,
        expandable = false,
        expanded = false,
        ...rest
    } = props

    const [expandedState, setExpandedState] = useState(expanded)

    const items = entity.sotavRolls

    if (!items.length)
        return <></>

    const itemVisible = items.filter(item => true).slice(0, limit)

    const onPress = () => {
        setExpandedState(!expandedState)
    }

    const inner = <>
        {
            itemVisible.map((item, index) => {
                const count = entity.SOSTAV_ROLLS_COUNT[item.ID] || 1
                return (
                    <View key={item.ID} style={[styles.label]} row>
                        {count > 1 && <Text text-xs-bo-lh0 grey20 numberOfLines={1}>{count} x </Text>}
                        <Text text-xs-lh0 text-regular grey20 numberOfLines={1}>{item.NAME}</Text>
                    </View>
                )
            })
        }
        {
            itemVisible.length < items.length && (
                <View style={styles.label}>
                    <Text primary text-xs-lh0>+ еще {items.length - itemVisible.length}</Text>
                </View>
            )
        }
    </>

    return expandable ?
        <TouchableOpacity
            row
            onPress={onPress}
            style={styles.container}
            {...rest}
        >
            {inner}
        </TouchableOpacity>
        :
        <View
            row
            style={styles.container}
            {...rest}
        >
            {inner}
        </View>
}

const styles = StyleSheet.create({
    container: {
        flexWrap: 'wrap',
        columnGap: 10,
        rowGap: 5
    },
    label: {
        borderColor: Colors.grey50,
        borderBottomWidth: 1,
        paddingVertical: 3,
        overflow: 'hidden',
        //maxWidth: 180
    },
    labelExpanded: {
        width: '100%',
        paddingHorizontal: 8,
        paddingVertical: 8,
    },
    labelMore: {
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 7,
        paddingVertical: 6,
    },
})


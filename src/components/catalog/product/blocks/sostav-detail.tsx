import React, {useCallback, useEffect, useState} from "react"
import {StyleSheet, ViewStyle} from "react-native"
import {Colors, Text, TouchableOpacity, View, ViewProps} from "react-native-ui-lib"
import {ProductModel} from "@core/catalog/model/Product"
import cleanText from "@core/main/util/react-native/cleanText"

type TProps = ViewProps & {
    containerStyle?: ViewStyle
    entity: ProductModel
    expandable?: boolean
    expanded?: boolean
    onPressDetail?: (entity: ProductModel) => void
    onExpand?: () => void
}

export const ProductSostavDetail: React.FC<TProps> = (
    {
        containerStyle = {},
        entity,
        expandable = false,
        expanded = false,
        onPressDetail,
        onExpand,
        ...rest
    }
) => {
    const [expandedState, setExpandedState] = useState(expanded)

    useEffect(() => {
        setExpandedState(expanded)
    }, [expanded])

    const onPressItem = useCallback((itemModel: ProductModel) => {
        if (!expandedState) {
            const newState = !expandedState
            setExpandedState(newState)
            onExpand && onExpand()
        } else {
            //onPressDetail && onPressDetail(itemModel)
        }
    }, [onExpand, onPressDetail, expandedState])

    if (!entity.sotavRolls.length)
        return <></>


    const inner = entity.sotavRolls.map((item, index) => {

        const count = entity.SOSTAV_ROLLS_COUNT[item.ID] || 1

        const itemContent = expandedState ? (
            <View
                style={[styles.label, styles.labelExpanded]}
                paddingH-9
                paddingV-5
                gap-4
            >
                <Text text-sm-m>{item.NAME}</Text>
                <Text text-xs-lh2 grey30 style={{flexWrap: "wrap"}}>{cleanText(item.PREVIEW_TEXT)}</Text>
            </View>
        ) : (
            <View
                style={[styles.label]}
                paddingH-7
                paddingV-2
                row
                gap-5
                centerV
            >

                {count > 1 && <Text
                    text-xs-bo
                    grey20
                >{count} х </Text>}

                <Text
                    text-xs
                    grey20
                    numberOfLines={1}
                >{item.NAME}</Text>
            </View>
        )

        return <TouchableOpacity key={item.ID} onPress={() => onPressItem(item)}>{itemContent}</TouchableOpacity>
    })

    return <View
        style={[expandedState ? styles.containerDetail : styles.container, containerStyle]}
        {...rest}
    >
        {inner}
    </View>
}

const styles = StyleSheet.create({
    container: {
        flexWrap: 'wrap',
        gap: 11,
        flexDirection: "row"
    },
    containerDetail: {
        gap: 11,
    },
    containerExpanded: {
        gap: 10
    },
    label: {
        borderColor: Colors.grey50,
        borderWidth: 1,
        borderRadius: 10,
        overflow: 'hidden'
    },
    labelExpanded: {
        width: '100%',
    },
})


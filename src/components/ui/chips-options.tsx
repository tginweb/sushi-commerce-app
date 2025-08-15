import React, {useEffect, useState} from "react"
import {StyleSheet} from "react-native"
import {Chip, ChipProps, View} from "react-native-ui-lib"
import {COLORS} from "~assets/design";

type TChipsOption = {
    props?: ChipProps,
    label: string
    value: any
}

type UiChipsOptionsProps = {
    items: TChipsOption[]
    itemProps?: ChipProps
    value?: any
    onChangeValue?: (value: any, option: TChipsOption) => void
    onChange?: (option: TChipsOption) => void
}

export const UiChipsOptions: React.FC<UiChipsOptionsProps> = (
    props
) => {

    const {
        items,
        itemProps = {},
        value,
        onChangeValue,
        onChange,
    } = props

    const [valueState, setValueState] = useState(value)

    useEffect(() => {
        
        setValueState(value)
    }, [value])

    const onItemPress = (item: TChipsOption) => {
        setValueState(item.value)
        onChangeValue && onChangeValue(item.value, item)
        onChange && onChange(item)
    }

    return <View style={styles.container}>
        {
            items.map((option) => {
                const selected = option.value === valueState

                const compProps = {
                    ...(itemProps || {}),
                    ...(option.props || {})
                }

                return <Chip
                    key={option.value}
                    label={option.label}
                    onPress={() => onItemPress(option)}
                    style={[styles.item, selected && styles.itemSelected]}
                    labelStyle={{color: COLORS.green20}}
                    iconProps={{tintColor: COLORS.green20}}
                    dismissContainerStyle={{borderColor: '#111111', borderWidth: 1}}
                    {...compProps}
                />
            })
        }
    </View>
}

const styles = StyleSheet.create({
    container: {
        gap: 20,
        flex: 1,
        flexWrap: 'wrap'
    },
    item: {},
    itemSelected: {},
})

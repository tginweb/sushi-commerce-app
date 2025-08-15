import React, {useEffect, useState} from "react"
import {StyleSheet} from "react-native"
import {UiList} from "./list"
import {UiListItemProps} from "~ui/list-item";
import {UiListProps} from "~ui/list/index.types";

export type UiOptionsOnChangeValue = (optionValue: any, optionData: any, option: UiListItemProps) => void

export type UiOptionsProps = UiListProps & {
    value?: any
    onChangeValue?: UiOptionsOnChangeValue
    onChange?: (option: UiListItemProps) => void
    onBeforeChange?: (option: UiListItemProps) => void | boolean
}

export const UiOptions: React.FC<UiOptionsProps> = (props) => {

    const {
        items,
        value,
        onChangeValue,
        onChange,
        onBeforeChange,
        ...rest
    } = props

    const [valueState, setValueState] = useState(value)

    //const errorContext = useError()

    useEffect(() => {
        
        setValueState(value)
    }, [value])

    const onItemPress = (item: UiListItemProps) => {
        if (onBeforeChange && onBeforeChange(item) === false) {
            return;
        }
        setValueState(item.value)
        onChangeValue && onChangeValue(item.value, item.data, item)
        onChange && onChange(item)
    }

    const options: UiListItemProps[] = items.map((item) => {
        return {
            ...item,
            selected: item.value === valueState,
            onPress: onItemPress
        }
    })

    return <UiList
        {...rest}
        items={options}
    />
}

const styles = StyleSheet.create({})

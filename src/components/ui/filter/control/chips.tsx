import React from "react"
import {StyleSheet} from "react-native"
import {TFilterControlProps, TFilterOption} from "@core/main/types";
import {FilterControlChip} from './chip';
import {ChipProps} from "react-native-ui-lib/src/components/chip";
import {View} from "react-native-ui-lib";

export type TFilterControlChipProps = TFilterControlProps & {
    itemProps?: ChipProps
    selectedOnly?: boolean
}

export const FilterControlChips: React.FC<TFilterControlChipProps> = (props) => {

    const {
        id,
        parentId,
        value,
        filter,
        onChange,
        scrollRefs,
        itemProps,
        container,
        selectedOnly
    } = props

    const _id = filter.name

    const valueComp = filter.multiple ? (value && Array.isArray(value) ? value : []) : value

    const onChangeItemState = (item: TFilterOption, newState: any) => {

        if (onChange) {

            if (!newState) {
                if (filter.multiple) {
                    onChange(valueComp.filter((value: any) => value !== item.value))
                } else {
                    onChange(null)
                }
            } else {
                if (filter.multiple) {
                    if (valueComp.indexOf((value: any) => value === item.value) === -1) {
                        onChange([...valueComp, item.value])
                    }
                } else {
                    onChange(item.value)
                }
            }
        }
    }

    const wrap = (children: any) => {
        return container ? <View {...container}>{children}</View> : children
    }

    return wrap(filter.options?.map(item => {
        const itemId = _id + '-' + item.value
        const active = filter.multiple ? valueComp.includes(item.value) : valueComp === item.value
        if (selectedOnly && !active)
            return <React.Fragment key={itemId}></React.Fragment>
        return <FilterControlChip
            id={itemId}
            filter={filter}
            key={item.value}
            label={item.label}
            dismissable={item.dismissable}
            value={active}
            onChange={(v: any) => onChangeItemState(item, v)}
            scrollRefs={scrollRefs}
            {...itemProps}
        />
    }))
}

const styles = StyleSheet.create({})

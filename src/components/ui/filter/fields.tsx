import React from "react"
import {StyleSheet} from "react-native"
import {TFilterItem} from "@core/main/types";
import {View} from "react-native-ui-lib";

export type TFilterFieldProps = {
    filters: TFilterItem[]
    value: any
    onChange?: any
    scrollRefs?: any
}

export const FilterFields: React.FC<TFilterFieldProps> = (props) => {

    const {filters, value, onChange, scrollRefs} = props

    const {
        ...rest
    } = props

    const onChangeInternal = (item: TFilterItem, newState: any) => {

        onChange && onChange({
            ...value,
            [item.name as any]: newState
        })
    }

    return <View {...rest}>
        {filters.map((filter, index) => {

            const Com = filter.field?.component

            return <Com
                key={filter.name}
                filter={filter}
                value={value[filter.name as string]}
                onChange={(v: any) => onChangeInternal(filter, v)}
                scrollRefs={scrollRefs}
                {...filter.field}
            />
        })}
    </View>
}

const styles = StyleSheet.create({})

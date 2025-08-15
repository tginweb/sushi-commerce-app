import React from "react"
import {StyleSheet} from "react-native"
import {TFilterItem} from "@core/main/types";
import {Text, View} from "react-native-ui-lib";

export type TFilterFieldProps = {
    filter: TFilterItem
    value: any
    label: string
    onChange?: any
    scrollRefs?: any
}

export const FilterField: React.FC<TFilterFieldProps> = (props) => {

    const {
        filter,
        label,
        value,
        onChange,
        scrollRefs,
        ...rest
    } = props

    const Com = filter.control?.component

    return <View gap-10 {...rest}>
        {label && <View><Text text-md-m-lh0>{label}</Text></View>}
        <Com
            value={value}
            scrollRefs={scrollRefs}
            filter={filter}
            onChange={onChange}
            container={filter.control?.container as any}
            {...(filter.control?.props as any)}
        />
    </View>
}

const styles = StyleSheet.create({})

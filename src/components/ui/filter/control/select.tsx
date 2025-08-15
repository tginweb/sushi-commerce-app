import React from "react"
import {StyleSheet} from "react-native"
import {TFilterControlProps} from "@core/main/types";
import {View} from "react-native-ui-lib";
import {UiPicker} from "~ui/picker";
import {COLORS, TYPOGRAPHY} from "~assets/design";
import {PickerFieldTypes} from "react-native-ui-lib/src/components/picker/types";

export type TFilterControlSelectProps = TFilterControlProps

export const FilterControlSelect: React.FC<TFilterControlSelectProps> = (props) => {

    const {
        value,
        filter,
        onChange,
        container
    } = props

    const options = filter.options || []

    const valueComp = filter.multiple ? (value && Array.isArray(value) ? value : []) : value

    const onSelect = (value: any) => {
        if (onChange) {
            onChange(value)
        }
    }
    return <View {...container}>
        <UiPicker
            placeholder={'Placeholder'}
            value={value}
            topBarProps={{
                doneLabel: 'Готово'
            }}
            fieldType={PickerFieldTypes.filter}
            onChange={onSelect as any}
            items={filter.options as any}
            useSafeArea={true}
            useWheelPicker={true}
            color={COLORS.primary}
            style={{
                color: COLORS.primary,
                ...TYPOGRAPHY["text-md-lh0"],
            }}
        />
    </View>
}

const styles = StyleSheet.create({})

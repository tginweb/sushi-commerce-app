import {Switch as VendorSwitch, Text, TouchableOpacity, View, ViewProps} from "react-native-ui-lib"
import React, {FC} from "react"
import {StyleSheet} from "react-native"
import {observer} from "mobx-react"
import {SwitchProps} from "react-native-ui-lib/src/components/switch"
import {COLORS} from "~assets/design";

export type UiSwitchProps = ViewProps & SwitchProps & {
    label: string
    labelModifiers?: any
    nowrap?: boolean
}
export const UiSwitchComponent: React.FC<UiSwitchProps> = (props, ref) => {

    const {
        label,
        labelModifiers = {
            'text-md-lh1': true
        },
        nowrap = false,
    } = props

    const {onValueChange, value} = props

    return (
        <View row centerV style={styles.container}>
            <View>
                <VendorSwitch
                    {...props}
                    onColor={COLORS.primary}
                />
            </View>
            <TouchableOpacity
                onPress={() => {
                    onValueChange && onValueChange(!value)
                }}
                style={[
                    !nowrap && {
                        flex: 1,
                        flexDirection: 'row',
                    }
                ]}
            >
                <Text style={{flex: 1, flexWrap: 'wrap'}} {...labelModifiers}>{label}</Text>
            </TouchableOpacity>

        </View>
    )
}

// @ts-ignore
export const UiSwitch: FC<UiSwitchProps> = observer(React.forwardRef(UiSwitchComponent))

const styles = StyleSheet.create({
    container: {
        gap: 10,
        flexWrap: 'nowrap'
    }
})

import React from "react"
import {StyleSheet, TextInput} from "react-native"
import {Text, View} from "react-native-ui-lib";
import {COLORS} from "~assets/design";

export type UiDebugFieldsProps = {
    gap?: 10,
    items: {
        label: string
        value: any
    }[]
}

export const UiDebugFields: React.FC<UiDebugFieldsProps> = (props) => {

    const {
        gap,
        items,
        ...rest
    } = props

    return <View
        {...rest}
    >
        {items.map((item, index) =>
            <View row gap-10 paddingV-10 style={styles.row} key={index}>
                <View flex-3><Text>{item.label}</Text></View>
                <View flex-9>
                    {item.value && <TextInput
                        value={item.value.toString()}
                        style={styles.value}
                    />}
                </View>
            </View>
        )}
    </View>
}

const styles = StyleSheet.create({
    row: {
        borderBottomWidth: 1,
        borderColor: COLORS.grey40
    },
    value: {
        borderWidth: 0,
        borderColor: COLORS.grey70
    },
})

import React from "react"
import {StyleSheet, Text} from "react-native"
import Animated from "react-native-reanimated"
import {TouchableOpacity} from "react-native-gesture-handler";

import CountMinusIcon from "~assets/icons/CountMinus"
import CountPlusIcon from "~assets/icons/CountPlus"

export type TQuantityInputProps = {
    value: string | number;
    onChange: any;
    size?: number
}

export const QuantityInput: React.FC<TQuantityInputProps> = (
    {
        value,
        onChange,
        size = 34
    }
) => {

    let valueState = typeof value === 'number' ? value : parseInt(value)

    const onDecrease = () => {
        valueState--
        onChange(valueState)
    }

    const onIncrease = () => {
        valueState++
        onChange(valueState)
    }

    return (
        <Animated.View style={[styles.rowCountManage]}>
            <TouchableOpacity
                onPress={() => {
                    onDecrease()
                }}
            >
                <CountMinusIcon width={size} height={size}/>
            </TouchableOpacity>
            <Text text-md-lh0 style={styles.value}>{valueState}</Text>
            <TouchableOpacity
                onPress={() => {
                    onIncrease()
                }}
            >
                <CountPlusIcon width={size} height={size}/>
            </TouchableOpacity>
        </Animated.View>
    )
};


const styles = StyleSheet.create({
    rowCountManage: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    value: {
        paddingLeft: 7,
        paddingRight: 7,
    }
});

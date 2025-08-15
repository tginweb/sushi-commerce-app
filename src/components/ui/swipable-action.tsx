import React from "react"
import {Animated, StyleSheet} from "react-native"
import {RectButton} from "react-native-gesture-handler"
import {Text} from "react-native-ui-lib"
import {TYPOGRAPHY} from "~assets/design";

type TProps = {
    text: string,
    icon: any,
    color: string,
    pressHandler: any,
    x: number,
    progress: Animated.AnimatedInterpolation<any>
}
export const SwipableAction: React.FC<TProps> = (
    {
        text,
        icon,
        color,
        pressHandler,
        x,
        progress
    }: TProps
) => {

    const trans = progress.interpolate({
        inputRange: [0, 1],
        outputRange: [x, 0],
    })

    return (
        <Animated.View style={{flex: 1, transform: [{translateX: trans}]}}>
            <RectButton
                style={[styles.rightAction, {backgroundColor: color}]}
                onPress={pressHandler}
            >
                {text && <Text style={styles.actionText}>{text}</Text>}
            </RectButton>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    actionText: {
        color: 'white',
        backgroundColor: 'transparent',
        padding: 10,
        ...TYPOGRAPHY['text-md']
    },
    rightAction: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
    },
})

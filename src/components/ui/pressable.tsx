import React from "react"
import {TouchableOpacity, TouchableOpacityProps, View, ViewProps} from "react-native-ui-lib"
import {StyleProp, StyleSheet, TouchableWithoutFeedback, ViewStyle} from "react-native"
import {TMenuAction} from "@core/main/types";
import {useStores} from "~stores";

export type UiPressableProps = TouchableOpacityProps & ViewProps & {
    notPressableWrapper?: boolean
    withoutFeedback?: boolean
    innerView?: boolean
    pressableStyle?: StyleProp<ViewStyle>
    onPressAction?: TMenuAction
}

export const UiPressable: React.FC<UiPressableProps> = (props) => {

    const {
        notPressableWrapper,
        children,
        withoutFeedback,
        innerView,
        pressableStyle,
        onPress,
        onPressAction,
        ...rest
    } = props

    const {menu} = useStores()

    const _onPress = onPress || onPressAction ? () => {

        onPress && onPress()
        onPressAction && menu.runActionItem(onPressAction)
    } : undefined

    const wrap = (content: any) => {

        if (_onPress) {
            let Wrapper: typeof TouchableOpacity | typeof TouchableWithoutFeedback

            if (withoutFeedback) {
                Wrapper = TouchableWithoutFeedback
            } else {
                Wrapper = TouchableOpacity
            }
            return innerView ?
                <Wrapper onPress={_onPress} style={pressableStyle}><View {...rest}>{content}</View></Wrapper>
                :
                <Wrapper onPress={_onPress} style={pressableStyle} {...rest as any}>{content}</Wrapper>
        } else {
            return <View {...rest}>{content}</View>
        }
    }

    return wrap(children)
}

const styles = StyleSheet.create({})

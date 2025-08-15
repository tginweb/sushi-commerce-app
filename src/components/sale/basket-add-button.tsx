import React from "react"
import {StyleSheet, ViewStyle} from "react-native"
import {TouchableWithoutFeedback, TouchableWithoutFeedbackProps} from "react-native-gesture-handler";
import icons from "~assets/icons-map";
import {COLORS} from "~assets/design";
import {View} from "react-native-ui-lib";

type TProps = TouchableWithoutFeedbackProps & {
    onPress: () => void
    outline?: boolean
    size?: number
}

export const BasketAddButton: React.FC<TProps> = (props) => {

    const {
        onPress,
        outline = false,
        size = 30,
        ...rest
    } = props

    const iconSize = size * 0.65
    const iconColor = outline ? COLORS.primaryLight : COLORS.white
    let viewStyle: ViewStyle = {
        width: size,
        height: size,
        borderRadius: size / 2,
        flex: 1
    }
    if (outline) {
        viewStyle = {
            ...viewStyle,
            borderColor: COLORS.primaryLight,
            borderWidth: 1
        }
    } else {
        viewStyle = {
            ...viewStyle,
            backgroundColor: COLORS.primaryLight
        }
    }

    return <TouchableWithoutFeedback
        onPress={onPress}
        {...rest}
    >
        <View
            reanimated
            centerH
            centerV
            style={[
                viewStyle
            ]}
        >
            {icons.plus({size: iconSize, color: iconColor})}
        </View>
    </TouchableWithoutFeedback>
}

const styles = StyleSheet.create({
    item: {},

});

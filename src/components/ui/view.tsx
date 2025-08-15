import React from "react"
import {Animated, StyleProp, StyleSheet, ViewStyle} from "react-native"
import {TBuildableComponentProps} from "@core/main/types";
import {UiBuildable} from "~ui/buildable";
import {Shadow, ShadowProps} from "react-native-shadow-2";
import {BORDER_RADIUS, COLORS} from "~assets/design";
import toInt from "@core/main/util/base/toInt";
import {UiPressable, UiPressableProps} from "~ui/pressable";

export type UiViewBaseProps = UiPressableProps & {
    shadow?: ShadowProps | boolean
    borderRadius?: keyof typeof BORDER_RADIUS | number
    border?: boolean | number
    borderColor?: keyof typeof COLORS
    fullWidth?: boolean
    onPress?: () => void
}

export const UiViewComponent: React.FC<UiViewBaseProps> = (props) => {

    const {
        style,
        border,
        borderColor,
        borderRadius,
        shadow,
        fullWidth,
        onPress,
        ...rest
    } = props

    const _style: StyleProp<ViewStyle | Animated.AnimatedProps<ViewStyle>> = Array.isArray(style) ? style : (style ? [style] : [])

    let _borderRadius: number = 0

    if (border || borderRadius) {

        const borderStyle: ViewStyle = {}

        if (border) {
            borderStyle.borderWidth = toInt(border, 1)
        }
        if (borderRadius) {
            _borderRadius = typeof borderRadius === 'string' ? BORDER_RADIUS[borderRadius] : borderRadius
            borderStyle.borderRadius = _borderRadius
        }
        if (borderColor) {
            //@ts-ignore
            borderStyle.borderColor = COLORS[borderColor] ? COLORS[borderColor] : borderColor
        }

        _style.push(borderStyle)
    }

    let result = <UiPressable
        {...rest}
        style={_style}
    />

    if (shadow) {

        let shadowProps = typeof shadow !== 'boolean' ? shadow : {}

        shadowProps = {
            ...shadowProps,
            distance: 6,
            startColor: 'rgba(0, 0, 0, 0.1)',
            endColor: 'rgba(0, 0, 0, 0.01)',
        }

        let {
            style: shadowStyle,
            ...shadowPropsRest
        } = shadowProps

        shadowStyle = Array.isArray(shadowStyle) ? shadowStyle : (shadowStyle ? [shadowStyle] : [])

        if (_borderRadius) {
            shadowStyle.push({
                borderRadius: _borderRadius
            })
        }

        if (fullWidth)
            shadowStyle.push({
                width: '100%',
            })

        result = <Shadow
            {...shadowPropsRest}
            style={shadowStyle}
        >{result}</Shadow>
    }

    return result
}

export type UiViewProps = UiViewBaseProps & TBuildableComponentProps

export const UiView: React.FC<UiViewProps> = (props) => {
    return props.templatableProps || props.condition ?
        <UiBuildable
            Component={UiViewComponent}
            {...props}
        />
        :
        <UiViewComponent {...props}/>
}

const styles = StyleSheet.create({})


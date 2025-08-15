import React from "react"
import {Button, Text, View, ViewProps, ButtonProps} from "react-native-ui-lib"
import {ActivityIndicator, Alert, GestureResponderEvent, StyleSheet, ViewStyle} from "react-native"
import {COLORS} from "~assets/design";
import {TConfirmProps} from "@core/ui/types";
import {ActionMobile} from "~gql/api";
import {useStores} from "~stores";
import {iconResolve} from "~ui/icon-resolver";
import {TouchableOpacityProps} from "react-native-ui-lib/src/components/touchableOpacity";
import Color from "color";


export type UiBtnProps = ButtonProps & {
    hideOnKeyboard?: boolean
    loading?: boolean
    loadingLabel?: string
    loadingHideLabel?: boolean
    icon?: any
    iconProps?: any
    iconSize?: number
    iconColor?: string
    themeColor?: string
    diameter?: number
    confirm?: TConfirmProps
    hidden?: boolean
    containerStyle?: ViewStyle
    buttonStyle?: ViewStyle
    rounded?: boolean | number
    labelBottom?: string
    prependSlot?: any
    viewProps?: ViewProps
    onPressAction?: ActionMobile
    action?: ActionMobile
}

export type TBtnOnPressCallback = (props?: TBtnOnPressCallbackPayload) => void

export type TBtnOnPressCallbackPayload = TouchableOpacityProps & {
    event: GestureResponderEvent;
}

export const UiBtn: React.FC<UiBtnProps> = (props) => {

    const _props = {...props}

    const {menu} = useStores()

    let backgroundColor, disabledBackgroundColor

    if (props.outline) {
        if (!props.outlineColor) {
            _props.outlineColor = props.color
        }
        backgroundColor = props.backgroundColor
    } else if (props.outline === false) {
        _props.outlineColor = props.backgroundColor
        backgroundColor = props.backgroundColor
    } else {
        backgroundColor = props.backgroundColor || COLORS.primary
    }

    let _backgroundColor = new Color(backgroundColor);
    disabledBackgroundColor = _backgroundColor.lighten(0.3).hex()

    let labelBottom = props.labelBottom

    let iconSource = props.iconSource

    let disabled = props.disabled

    /*
    iconResolver({
        source: props.icon,
        overrides: props.iconProps
    })({
        color: iconColor,
        size: iconSize,
        style: _iconStyle
    })

     */

    if (props.loading) {

        disabled = true

        if (_props.loadingHideLabel) {
            _props.label = undefined
            iconSource = () => <ActivityIndicator
                color={!props.outline && !props.link ? '#FFFFFF' : props.color}
                size={props.iconSize || 20}
            />
        } else {
            iconSource = () => <ActivityIndicator
                style={{marginRight: 10}}
                color={!props.outline && !props.link ? '#FFFFFF' : props.color}
                size={props.iconSize || 20}
            />
        }
    } else if (props.icon) {
        iconSource = (iconStyle: any) => {

            const _iconStyle = Array.isArray(iconStyle) ? StyleSheet.flatten(iconStyle) : iconStyle

            const iconColor = props.iconColor || _iconStyle.tintColor
            const iconSize = props.iconSize || 16

            delete _iconStyle.tintColor

            return iconResolve(props.icon, {
                color: iconColor,
                size: iconSize,
                style: _iconStyle
            })
        }
    }

    const style: ViewStyle = {...props.buttonStyle} || {}

    if (props.diameter) {
        style.width = props.diameter
        style.height = props.diameter
    }

    if (props.rounded) {
        style.borderRadius = typeof props.rounded === 'boolean' ? 10 : props.rounded
    }

    const onPressRun = () => {
        if (props.onPress) {
            props.onPress()
            if (props.action) {
                setTimeout(() => props.action && menu.runActionItem(props.action), 30)
            }
        } else if (props.action) {
            menu.runActionItem(props.action)
        } else if (props.onPressAction) {
            menu.runActionItem(props.onPressAction)
        }
    }

    const onPress = (p: TBtnOnPressCallbackPayload) => {

        if (props.confirm) {
            Alert.alert(
                props.confirm.title || 'Вниимание',
                props.confirm.message || 'Подтвердите операцию',
                [
                    {
                        text: props.confirm.okLabel || "Ok",
                        onPress: () => {
                            onPressRun()
                        },
                        style: 'default',
                        isPreferred: true
                    },
                    {
                        text: props.confirm.cancelLabel || "Отмена",
                        style: 'cancel'
                    },
                ]
            )
        } else {
            onPressRun()
        }
    }


    return (
        labelBottom ?
            <View flex centerH>
                <Button
                    disabledBackgroundColor={disabledBackgroundColor}
                    {..._props}
                    iconSource={iconSource}
                    disabled={disabled}
                    style={style}
                    onPress={onPress}
                />
                {!!labelBottom && <Text marginT-5 text-xs>{labelBottom}</Text>}
            </View>
            : (
                _props.viewProps ?
                    <View {..._props.viewProps}>
                        <Button
                            disabledBackgroundColor={disabledBackgroundColor}
                            borderRadius={12}
                            {..._props}
                            iconSource={iconSource}
                            disabled={disabled}
                            style={style}
                            onPress={onPress}
                        />
                    </View>
                    :
                    <Button
                        disabledBackgroundColor={disabledBackgroundColor}
                        borderRadius={12}
                        {..._props}
                        iconSource={iconSource}
                        disabled={disabled}
                        style={style}
                        onPress={onPress}
                    />
            )

    )
}

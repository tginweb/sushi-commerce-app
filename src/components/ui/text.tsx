import React from "react"
import {GestureResponderEvent, StyleSheet} from "react-native"
import {Text, TextProps} from "react-native-ui-lib";
import {TBuildableComponentProps, TMenuAction} from "@core/main/types";
import {UiBuildable} from "~ui/buildable";
import {useStores} from "~stores";

export type UiTextProps = TextProps & TBuildableComponentProps & {
    onPressAction?: TMenuAction
}

export const UiText: React.FC<UiTextProps> = (props) => {

    const {
        templatableProps,
        condition,
        onPressAction,
        vars,
        ...rest
    } = props

    const {menu} = useStores()


    if (templatableProps || condition)
        return <UiBuildable
            Component={UiText}
            {...props}
        />

    let _onPress = onPressAction ? (event: GestureResponderEvent) => {
        menu.runActionItem(onPressAction as any)
    } : undefined

    return <Text
        onPress={_onPress}
        {...rest}
    />
}

const styles = StyleSheet.create({})

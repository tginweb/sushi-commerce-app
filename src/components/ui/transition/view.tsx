import React from "react"
import {StyleSheet} from "react-native"
import * as Animatable from "react-native-animatable";

import {presets, TUiTransitionProps, useCommon} from "./hooks";
import {generateModifiersStyle} from "~assets/design";

export const UiTransitionView: React.FC<TUiTransitionProps> = (props) => {

    let {
        children,
        preset,
        ...propsWithoutChildren
    } = props

    if (preset && presets[preset]) {
        propsWithoutChildren = {
            ...presets[preset],
            ...propsWithoutChildren,
        }
    }

    const {
        visibleState,
        stateProps,
        restProps
    } = useCommon(propsWithoutChildren)

    if (!visibleState)
        return <></>

    // @ts-ignore
    return <Animatable.View
        {...stateProps}
        {...restProps}
        style={generateModifiersStyle(restProps)}
    >
        {children}
    </Animatable.View>

}

const styles = StyleSheet.create({})



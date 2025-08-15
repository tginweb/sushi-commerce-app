import React from "react"
import {StyleSheet} from "react-native"
import {View, ViewProps} from "react-native-ui-lib";
import icons from "~assets/icons-map";
import {COLORS} from "~assets/design";
import {TIconProps} from "@core/main/types";
import {observer} from "mobx-react";

type TProps = ViewProps & {
    active: boolean
    iconProps?: TIconProps
}

export const ProductFav: React.FC<TProps> = React.memo(observer((props) => {

    const {
        iconProps,
        active,
        ...rest
    } = props

    if (!active)
        return <></>

    return <View {...rest}>
        {icons.heartSolid({
            size: 13,
            color: COLORS.red30,
            ...iconProps
        })}
    </View>
}))

const styles = StyleSheet.create({})


import React from "react"
import {StyleSheet} from "react-native"
import {Text, View} from "react-native-ui-lib"
import icons from "~assets/icons-map"
import {COLORS} from "~assets/design";
import {TIconProps} from "@core/main/types";

export type TBodyEmptyProps = {
    title?: string
    caption?: string
    icon?: any
    iconProps?: TIconProps
}

export const UiBodyEmpty: React.FC<TBodyEmptyProps> = (
    {
        title,
        caption,
        icon = icons.emptyList,
        iconProps = {}
    }
) => {
    return <View center style={{gap: 10}}>
        {
            icon && icon({
                ...{color: COLORS.grey30, size: 30},
                ...iconProps,
            })
        }
        {title && <Text style={styles.title}>{title}</Text>}
        {caption && <Text style={styles.caption}>{caption}</Text>}
    </View>
}

const styles = StyleSheet.create({
    container: {},
    title: {},
    caption: {},
})

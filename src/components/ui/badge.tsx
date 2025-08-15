import React from "react"
import {ActivityIndicator, StyleSheet} from "react-native"
import {Badge} from "react-native-ui-lib";
import {BadgeProps} from "react-native-ui-lib/src/components/badge";
import {TBuildableComponentProps} from "@core/main/types";
import {UiBuildable} from "~ui/buildable";
import {COLORS} from "~assets/design";

export type UiBadgeProps = BadgeProps & TBuildableComponentProps & {
    loading?: boolean | string
    visible?: boolean | string
}

export const UiBadge: React.FC<UiBadgeProps> = (props) => {

    const {
        templatableProps,
        condition,
        loading,
        visible = true,
        ...rest
    } = props

    if (templatableProps || condition)
        return <UiBuildable
            Component={UiBadge}
            {...props}
        />

    if (loading)
        return <ActivityIndicator color={COLORS.primary}/>

    if (!visible)
        return;

    return <Badge {...rest}/>
}

const styles = StyleSheet.create({
    container: {},
    title: {},
    caption: {},
})

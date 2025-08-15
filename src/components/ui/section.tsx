import React, {PropsWithChildren} from "react"
import {Card, Text, TouchableOpacity, View} from "react-native-ui-lib"
import {StyleSheet, TextStyle, ViewStyle} from "react-native";
import {TPresetName} from "@core/main/types";
import {TYPOGRAPHY} from "~assets/design";
import {usePresets} from "@core/main/lib/hooks/usePresets";

type UiSectionProps = {
    headerTitle?: string
    headerTitleStyle?: TextStyle
    headerSideSlot?: any
    headerOnPress?: () => void
    headerOnLongPress?: () => void
    children?: any
    bodyStyle?: ViewStyle
    style?: ViewStyle
    preset?: TPresetName
    hide?: boolean
    onPress?: () => void
}

export const UiSection: React.FC<UiSectionProps> = (props) => {

    const {
        headerTitle,
        headerTitleStyle,
        headerSideSlot,
        headerOnPress,
        headerOnLongPress,
        bodyStyle = {},
        style,
        children,
        preset,
        hide = false,
        onPress
    } = props

    const presetRes = usePresets(props, preset, presets, [])

    if (hide) return <></>

    const HeaderTag: React.FC<PropsWithChildren> = ({children}) => {
        return headerOnPress ?
            <TouchableOpacity
                onPress={headerOnPress}
                onLongPress={headerOnLongPress}
                style={styles.header}
            >{children}</TouchableOpacity>
            :
            <View style={styles.header}>{children}</View>
    }

    const Wrapper = ({children}: any) => {
        return onPress ? <TouchableOpacity onPress={onPress}>{children}</TouchableOpacity> : children
    }

    return (
        <Wrapper>
            <Card
                flex
                style={[
                    styles.container,
                    presetRes.styles.container,
                    style,
                ]}
                {...(presetRes.props || {})}
            >
                {
                    (headerTitle || headerSideSlot) && <HeaderTag>
                        <View style={styles.headerLeft}>
                            <Text style={[
                                styles.headerTitle,
                                presetRes.styles.headerTitle,
                                headerTitleStyle
                            ]}>{headerTitle}</Text>
                        </View>
                        <View style={styles.headerRight}>
                            {headerSideSlot}
                        </View>
                    </HeaderTag>
                }

                {children && (
                    <View style={[styles.body, bodyStyle]}>
                        {children}
                    </View>
                )}

            </Card>
        </Wrapper>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 10,
        paddingHorizontal: 13,
        gap: 9
    },
    header: {
        flexDirection: 'row',
        flexGrow: 1,
        flexShrink: 1,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    headerLeft: {
        flexShrink: 1,
    },
    headerRight: {
        flexShrink: 1,
    },
    headerTitle: {
        ...TYPOGRAPHY["text-lg-bo"],
    },
    body: {}
})

const presets = {
    filled: () => ({
        props: {
            enableShadow: false
        },
        styles: StyleSheet.create({
            container: {
                backgroundColor: '#F7F7F7'
            },
            headerTitle: {
                color: '#42555e',
                ...TYPOGRAPHY['text-sm-bo-lh0']
            }
        }),
    }),
    dense: () => ({
        styles: StyleSheet.create({
            container: {
                padding: 8,
                gap: 14
            },
        }),
    }),
}

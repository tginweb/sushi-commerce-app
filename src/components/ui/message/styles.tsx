import {StyleSheet} from "react-native";
import IconInfo from "~assets/icons/Info";
import IconSuccess from "~assets/icons/Check";
import IconError from "~assets/icons/Error";
import React from "react";
import {UiMessageProps} from "~ui/message/message";
import {TIconRender} from "@core/main/types";
import {ToastOptions} from "~ui/toast";
import {TYPOGRAPHY} from "~assets/design";

export const styles = StyleSheet.create({
    container: {
        borderRadius: 10,
        paddingHorizontal: 13,
        paddingVertical: 13,
    },
    row: {
        gap: 9,
        flexWrap: "nowrap"
    },
    message: {
        ...TYPOGRAPHY['text-md-lh2']
    },
    actionsInline: {},
    actionsBlock: {
        marginTop: 10,
        flex: 1,
        alignSelf: 'flex-start',
    },
})

export const messageTypes: Record<string, {
    icon: TIconRender,
    color: string,
    bgColor: string,
    toast?: ToastOptions
}> = {
    info: {
        icon: ({color, size}: any) => <IconInfo fill={color} width={size} height={size}/>,
        color: '#2c525d',
        bgColor: '#2c525d',
        toast: {
            duration: 4000
        }
    },
    success: {
        icon: ({color, size}: any) => <IconSuccess fill={color} width={size} height={size}/>,
        color: '#1ca834',
        bgColor: 'rgb(46, 125, 50)',
        toast: {
            duration: 5000
        }
    },
    error: {
        icon: ({color, size}: any) => <IconError fill={color} width={size} height={size}/>,
        color: '#ad3018',
        bgColor: 'rgb(211, 47, 47)',
        toast: {
            duration: 8000
        }
    },
    warning: {
        icon: ({color, size}: any) => <IconError fill={color} width={size} height={size}/>,
        color: 'rgb(237, 108, 2)',
        bgColor: 'rgb(237, 108, 2)',
        toast: {
            duration: 5000
        }
    },
}


const typePresets = Object.keys(messageTypes).reduce<any>((map, typeKey) => {
    const typeInfo = messageTypes[typeKey]
    map['type-' + typeKey] = ({color}: UiMessageProps) => ({
        ...typeInfo,
        icon: ({color}: any) => typeInfo.icon({color, size: 20})
    })
    return map
}, {})

export const presets = {
    ...typePresets,
    center: ({color}: UiMessageProps) => ({
        styles: StyleSheet.create({
            row: {
                justifyContent: 'center'
            },
            message: {}
        }),
    }),

    dense: ({color}: UiMessageProps) => ({
        icon: {
            color: color
        },
        styles: StyleSheet.create({
            container: {
                paddingHorizontal: 6,
                paddingVertical: 4
            },
            message: {
                ...TYPOGRAPHY['text-sm']
            }
        }),
    }),

    outline: ({color}: UiMessageProps) => ({
        icon: {
            color: color
        },
        styles: StyleSheet.create({
            container: {
                borderWidth: 1,
                borderColor: color,
            },
            message: {
                color: color
            }
        }),
    }),

    flat: ({color}: UiMessageProps) => ({
        icon: {
            color: color
        },
        styles: StyleSheet.create({
            container: {
                paddingHorizontal: 0
            },
            message: {
                color: color
            }
        }),
    }),

    filled: ({color}: UiMessageProps) => ({
        icon: {
            color: '#FFFFFF'
        },
        styles: StyleSheet.create({
            container: {
                backgroundColor: color
            },
            message: {
                color: '#FFFFFF'
            }
        }),
    }),
}

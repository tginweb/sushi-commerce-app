import {StyleSheet} from "react-native";
import {COLORS, TYPOGRAPHY} from "~assets/design";
import {UiTextFieldProps} from "~ui/text-field/index";

export const presets = {

    default: ({styleColor}: UiTextFieldProps) => ({
        action: {
            color: COLORS.primary,
            outline: true,
            round: true,
            iconSize: 18,
            size: 'xSmall',
        },
        styles: StyleSheet.create({
            actionsInner: {
                //right: 7
            },
            field: {
                backgroundColor: '#FFFFFF'
            },
        })
    }),
    center: ({styleColor}: UiTextFieldProps) => ({
        styles: StyleSheet.create({
            input: {
                textAlign: 'center'
            },
        })
    }),
    underline: ({styleColor}: UiTextFieldProps) => ({
        styles: StyleSheet.create({
            field: {
                borderBottomWidth: 1,
                paddingBottom: 4,
                borderColor: styleColor
            },
        })
    }),
    outline: ({styleColor}: UiTextFieldProps) => ({
        styles: StyleSheet.create({
            field: {
                borderWidth: 1,
                padding: 4,
                borderRadius: 6,
                borderColor: styleColor
            },
            floatingPlaceholder: {
                paddingHorizontal: 5,
                ...TYPOGRAPHY['text-xl-lh0'],
                marginTop: -4,
                alignSelf: 'flex-start',
                borderRadius: 10,
                overflow: 'hidden'
            }
        })
    }),
    xs: ({styleColor}: UiTextFieldProps) => ({
        action: {
            iconSize: 20,
            size: 'xSmall',
        },
        styles: StyleSheet.create({
            field: {
                paddingVertical: 8,
                paddingHorizontal: 10,
                borderRadius: 8,
            },
            input: {
                ...TYPOGRAPHY["text-sm"]
            },
            floatingPlaceholder: {
                ...TYPOGRAPHY["text-xxs"]
            },
            actionsInner: {
                right: 13
            }
        })
    }),
    sm: ({styleColor}: UiTextFieldProps) => ({
        action: {
            iconSize: 20,
            size: 'xSmall',
        },
        styles: StyleSheet.create({
            field: {
                paddingVertical: 8,
                paddingHorizontal: 10,
                borderRadius: 8,
            },
            input: {
                ...TYPOGRAPHY["text-lg"],
            },
            floatingPlaceholder: {
                ...TYPOGRAPHY["text-md"],
                marginTop: -1
            },
            actionsInner: {
                right: 13
            }
        })
    }),

    md: ({styleColor}: UiTextFieldProps) => ({
        action: {
            iconSize: 23,
            size: 'xSmall',
        },
        styles: StyleSheet.create({
            field: {
                paddingVertical: 10,
                paddingHorizontal: 12,
                borderRadius: 8,
            },
            input: {
                ...TYPOGRAPHY["text-xl"],
            },
            floatingPlaceholder: {
                ...TYPOGRAPHY["text-lg"],
                marginTop: -2,
            },
            actionsInner: {
                right: 13
            }
        })
    }),

    lg: ({styleColor}: UiTextFieldProps) => ({
        action: {
            iconSize: 23,
            size: 'xSmall',
        },
        styles: StyleSheet.create({
            field: {
                paddingVertical: 13,
                paddingHorizontal: 13,
                borderRadius: 8,
            },
            input: {
                ...TYPOGRAPHY["text-xxl"],
            },
            floatingPlaceholder: {
                ...TYPOGRAPHY["text-xl"],
            },
            actionsInner: {
                right: 13
            }
        })
    }),

}

export const styles = StyleSheet.create({
    fieldStyle: {
        paddingVertical: 10,
        paddingHorizontal: 10,
    },
    fieldStyleError: {
        borderColor: COLORS.red30
    },
    container: {
        position: 'relative',
    },
    actionsInner: {
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        flex: 1,
    },
    actionsOuter: {},
    main: {
        gap: 12,
        maxWidth: '100%',
        position: 'relative',
        //borderWidth: 1
    },
    optionsCommon: {
        borderRadius: 10,
        backgroundColor: COLORS.grey80,
        marginTop: 10,
        marginBottom: 10,
    },
    optionsNonScrollable: {
        position: "relative",
        overflow: 'hidden',
    },
    optionsScrollable: {},
    option: {
        paddingHorizontal: 13,
        borderBottomWidth: 1,
        paddingVertical: 11,
        borderColor: COLORS.grey50,
    },
    optionText: {
        ...TYPOGRAPHY['text-lg']
    },
    errorView: {
        marginTop: 4,
        gap: 10
    },
    errorItem: {},
    errorItemText: {
        color: '#AA0000'
    }
})

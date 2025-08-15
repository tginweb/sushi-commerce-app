import {StyleSheet} from "react-native"
import {Shadows} from "react-native-ui-lib";
import {COLORS, THEME_STYLE, TYPOGRAPHY} from "~assets/design";

export const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
    },
    cell: {
        // borderWidth: 1,
        // borderColor: '#CCCCCC'
    },
    radioCell: {
        alignSelf: 'stretch',
        justifyContent: 'center'
    },
    radio: {
        marginHorizontal: 15,
    },
    mainCell: {
        flexShrink: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12
    },
    main: {
        flexDirection: 'row',
        flexGrow: 1,
        flexShrink: 1,
        justifyContent: 'space-between'
    },
    mainWrap: {
        flexDirection: 'column',
        width: '100%',
    },
    iconCell: {},
    label: {},
    caption: {
        ...TYPOGRAPHY['text-xs'],
        color: COLORS.grey30
    },
    info: {
        flexShrink: 1,
    },
    content: {
        flexShrink: 1,
    },
    contentText: {
        textAlign: 'right'
    },
    contentTextWrap: {
        textAlign: 'left'
    },
    rightButtonsCell: {
        flexGrow: 1
    },
    rightButtons: {
        flexDirection: 'row',
        flexGrow: 1,
    }
})

export const presets = {
    info: () => ({
        icon: {
            size: 20,
            color: COLORS.green30
        },
        styles: StyleSheet.create({
            container: {
                gap: 12,
                paddingHorizontal: 12,
            },
            main: {
                gap: 12,
                flexDirection: "row",
                paddingVertical: 16,
            },
            iconCell: {
                paddingVertical: 16,
                width: 30
            },
            label: {},
            info: {
                flexGrow: 1
            },
        }),
    }),

    rounded: () => ({
        styles: StyleSheet.create({
            container: {
                borderRadius: 10,
                ...Shadows.sh20.bottom
            },
        }),
    }),
    separated: () => ({
        styles: StyleSheet.create({
            main: {
                borderBottomColor: '#dddddd',
                borderBottomWidth: 1
            },
            mainLast: {
                borderBottomWidth: 0
            },
        }),
    }),
    fields: () => ({
        styles: StyleSheet.create({
            label: {
                color: '#2c525d',
            },
            container: {
                gap: 12,
                borderBottomColor: '#dddddd',
                borderBottomWidth: 1,
                paddingVertical: 10,
                //borderWidth: 1
            },
            containerLast: {
                borderBottomWidth: 0,
                //paddingBottom: 0,
            },
            containerFirst: {
                //paddingTop: 0,
            },
            main: {
                gap: 10,
                flexDirection: "row",
                //borderWidth: 1
            },
            mainWrap: {
                gap: 4,
            },
            more: {
                //borderWidth: 1
            },
            iconCell: {
                paddingVertical: 2,
                width: 30
            },
            info: {
                flexGrow: 1,
                flexShrink: 0,
            },
            content: {},
            contentTextPressable: {}
        }),
    }),
    menu: () => ({
        styles: StyleSheet.create({
            container: {
                gap: 12,
                backgroundColor: '#FFFFFF',
                paddingVertical: 16,
                paddingHorizontal: 16,
                borderRadius: 12,
                flexWrap: 'nowrap',
                alignItems: 'center'
            },
            label: {
                color: COLORS.grey10,
                ...TYPOGRAPHY['text-xl'],
                fontWeight: '300'
            },
            caption: {
                color: COLORS.grey30,
                ...TYPOGRAPHY['text-md'],
                marginTop: 5
            },
            containerLast: {},
            containerFirst: {},
            mainCell: {
                flexGrow: 1
            },
            main: {
                gap: 12,
                flexDirection: "row",
                alignItems: 'center'
            },
            iconCell: {},
            info: {
                flexGrow: 1
            },
            contentTextPressable: {},
            sideCell: {
                flexDirection: 'row',
                alignSelf: 'flex-start',
                flexWrap: 'nowrap',
            }
        }),
    }),
    info1: () => ({
        icon: {
            size: 19,
            color: COLORS.primaryLight
        },
        styles: StyleSheet.create({
            container: {
                gap: 12,
                paddingVertical: 10,
                paddingHorizontal: 16,
                borderRadius: 20,
                backgroundColor: '#F7F7F7',
                alignItems: 'center',
                //borderWidth: 1
            },
            label: {
                color: COLORS.grey10,
                ...TYPOGRAPHY['text-lg'],
            },
            caption: {
                color: COLORS.grey40,
                ...TYPOGRAPHY['text-md'],
                marginTop: 5
            },
            containerLast: {},
            containerFirst: {},
            main: {
                gap: 12,
                flexDirection: "row",
                //borderWidth: 1
            },
            sideCell: {
                //borderWidth: 1
            },
            iconCell: {
                paddingVertical: 10,
                width: 30
            },
            info: {
                flexGrow: 1,
            },
        }),
    }),
    screenOptions: () => ({
        styles: StyleSheet.create({
            container: {
                gap: 0,
                backgroundColor: '#FFFFFF',
                borderWidth: 1,
                borderRadius: 10,
                borderColor: '#666666',
                alignItems: 'center'
            },
            containerSelected: {
                borderColor: COLORS.primary,
                borderWidth: 2,
            },
            cell: {},
            label: {
                color: COLORS.grey10,
                ...TYPOGRAPHY['text-lg'],
            },
            caption: {
                color: COLORS.grey40,
                ...TYPOGRAPHY['text-sm'],
                marginTop: 5
            },
            mainCellFirstChild: {
                paddingLeft: 14
            },
            mainCellLastChild: {
                paddingRight: 14
            },
            main: {
                gap: 12,
                flexDirection: "row",
                paddingVertical: 14,
            },
            info: {
                flexGrow: 1
            },
            sideCell: {}
        }),
    }),
    formOptions: () => ({
        icon: {
            size: 20,
            color: COLORS.primaryLighter
        },
        iconSelected: {
            size: 20,
            color: COLORS.primary
        },
        styles: StyleSheet.create({
            container: {
                gap: 0,
                backgroundColor: '#FFFFFF',
                borderWidth: 1,
                borderRadius: 10,
                borderColor: '#666666',
                alignItems: 'center'
            },
            containerSelected: {
                borderColor: COLORS.primary,
                borderWidth: 2,
            },
            cell: {},
            label: {
                color: COLORS.grey10,
                ...TYPOGRAPHY['text-md'],
            },
            labelSelected: {
                //fontWeight: '600'
            },
            caption: {
                color: COLORS.grey40,
                ...TYPOGRAPHY['text-sm'],
                marginTop: 5
            },
            contentText: {
                ...TYPOGRAPHY['text-sm'],
            },
            mainCellFirstChild: {
                paddingLeft: 14
            },
            mainCellLastChild: {
                paddingRight: 14
            },
            main: {
                gap: 12,
                flexDirection: "row",
                paddingVertical: 13,
            },
            info: {
                flexGrow: 1,
                justifyContent: 'center'
            },
            sideCell: {
                paddingRight: 14,
            }
        }),
    }),
    switchOptions: () => ({
        icon: {
            size: 16,
            color: COLORS.grey30
        },
        iconSelected: {
            size: 16,
            color: COLORS.primary
        },
        styles: StyleSheet.create({
            container: {
                gap: 1,
                backgroundColor: '#FFFFFF',
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 6,
                paddingHorizontal: 6,
                borderRadius: 10,

                shadowColor: "#000",
                shadowOffset: {
                    width: 1,
                    height: 1,
                },
                shadowOpacity: 0.20,
                shadowRadius: 2,
                elevation: 2,
            },
            containerSelected: {
                borderColor: COLORS.primary,
                borderWidth: 1,
            },
            iconCell: {
                flexShrink: 1,
                //borderWidth: 1
            },

            mainCell: {
                flexShrink: 1,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6
            },
            cell: {},
            label: {
                color: COLORS.grey10,
                ...TYPOGRAPHY['text-sm-lh1'],
            },
            labelSelected: {
                color: COLORS.primary,
                //fontWeight: '600'
            },
            caption: {
                color: COLORS.grey40,
                ...TYPOGRAPHY['text-sm'],
                marginTop: 5
            },
            contentText: {
                ...TYPOGRAPHY['text-sm'],
            },
            main: {
                flexGrow: 0,
                gap: 0,
                flexDirection: "row",
            },
            info: {},
            sideCell: {}
        }),
    }),

    chip: () => ({
        icon: {
            size: 20,
            color: COLORS.primaryLighter
        },
        iconSelected: {
            size: 20,
        },
        styles: StyleSheet.create({
            container: {
                gap: 0,
                backgroundColor: '#FFFFFF',
                borderWidth: 1,
                borderRadius: 30,
                borderColor: '#CCCCCC',
                alignItems: 'center',
                flexDirection: 'row',
                paddingHorizontal: 7,
            },
            containerSelected: {
                backgroundColor: COLORS.primary,
                borderColor: COLORS.primary,
            },
            cell: {},
            label: {
                color: COLORS.grey10,
                ...TYPOGRAPHY['text-xs'],
            },
            iconCellSelected: {
                backgroundColor: '#FFFFFF',
                borderRadius: 20
            },
            labelSelected: {
                color: COLORS._white,
                ...TYPOGRAPHY['text-sm'],
            },
            contentText: {
                ...TYPOGRAPHY['text-sm'],
            },
            mainCell: {
                flexDirection: 'row',
                gap: 5,
            },
            main: {
                gap: 2,
                flexDirection: "row",
                paddingVertical: 4,
                flexGrow: 0,
                flexShrink: 1,
                justifyContent: 'space-between'
            },
            info: {},
            sideCell: {
                paddingRight: 0
            }
        }),
    }),

    chip_selected_outline: () => ({
        styles: StyleSheet.create({
            containerSelected: {
                backgroundColor: COLORS._white,
                borderColor: COLORS.primary,
                borderWidth: 2,
            },
            labelSelected: {
                color: COLORS.primary,
            },
        }),
    }),

    menu2: () => ({
        icon: {
            size: 20,
            color: COLORS.primary
        },
        styles: StyleSheet.create({
            container: {
                gap: 12,
                paddingVertical: 11,
                paddingHorizontal: 16,
                borderRadius: 20,
                backgroundColor: COLORS._white,
                borderWidth: 1,
                borderColor: COLORS.grey50
            },
            label: {
                color: COLORS.grey10,
                ...TYPOGRAPHY['text-lg'],
            },
            caption: {
                color: COLORS.grey40,
                ...TYPOGRAPHY['text-sm'],
                marginTop: 5
            },
            containerLast: {},
            containerFirst: {},
            main: {
                gap: 12,
                flexDirection: "row",
                alignItems: 'center'
            },
            iconCell: {},
            info: {
                flexGrow: 1
            },
            sideCell: {
                alignItems: 'center'
            },
            more: {
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center'
            }
        }),
    }),

    rows: () => ({
        icon: {
            size: 20,
            color: COLORS.primary
        },
        styles: StyleSheet.create({
            container: {
                gap: 12,
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: COLORS.grey50
            },
            label: {
                color: COLORS.grey10,
                ...TYPOGRAPHY['text-lg'],
            },
            caption: {
                color: COLORS.grey40,
                ...TYPOGRAPHY['text-sm'],
                marginTop: 5
            },
            containerLast: {},
            containerFirst: {},
            main: {
                gap: 12,
                flexDirection: "row",
                alignItems: 'center'
            },
            iconCell: {},
            info: {
                flexGrow: 1
            },
            sideCell: {
                alignItems: 'center'
            },
            more: {
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center'
            }
        }),
    }),
}


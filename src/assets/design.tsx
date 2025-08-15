import {Dimensions, StyleSheet, TextStyle, ViewStyle} from "react-native"
import {BorderRadiuses, Colors, Modifiers, Spacings, ThemeManager, Typography} from "react-native-ui-lib"


import toArray from "@core/main/util/base/toArray"
import {scaleFont, verticalScale} from "@core/main/lib/scale";


export const BORDER_RADIUS = {
    xs: 8,
    sm: 10,
    md: 12,
    lg: 14,
    xl: 16,
}

export const FONT_FAMILY = {
    regular: 'ttr',
    medium: 'ttm',
    bold: 'ttb',
}

type TTypographyName =
    "text-4xs"
    | "text-4xs-lh0"
    | "text-4xs-lh1"
    | "text-4xs-lh2"
    | "text-4xs-lh3"
    | "text-4xs-t"
    | "text-4xs-t-lh0"
    | "text-4xs-t-lh1"
    | "text-4xs-t-lh2"
    | "text-4xs-t-lh3"
    | "text-4xs-l"
    | "text-4xs-l-lh0"
    | "text-4xs-l-lh1"
    | "text-4xs-l-lh2"
    | "text-4xs-l-lh3"
    | "text-4xs-r"
    | "text-4xs-r-lh0"
    | "text-4xs-r-lh1"
    | "text-4xs-r-lh2"
    | "text-4xs-r-lh3"
    | "text-4xs-m"
    | "text-4xs-m-lh0"
    | "text-4xs-m-lh1"
    | "text-4xs-m-lh2"
    | "text-4xs-m-lh3"
    | "text-4xs-bo"
    | "text-4xs-bo-lh0"
    | "text-4xs-bo-lh1"
    | "text-4xs-bo-lh2"
    | "text-4xs-bo-lh3"
    | "text-4xs-h"
    | "text-4xs-h-lh0"
    | "text-4xs-h-lh1"
    | "text-4xs-h-lh2"
    | "text-4xs-h-lh3"
    | "text-4xs-bl"
    | "text-4xs-bl-lh0"
    | "text-4xs-bl-lh1"
    | "text-4xs-bl-lh2"
    | "text-4xs-bl-lh3"
    | "text-3xs"
    | "text-3xs-lh0"
    | "text-3xs-lh1"
    | "text-3xs-lh2"
    | "text-3xs-lh3"
    | "text-3xs-t"
    | "text-3xs-t-lh0"
    | "text-3xs-t-lh1"
    | "text-3xs-t-lh2"
    | "text-3xs-t-lh3"
    | "text-3xs-l"
    | "text-3xs-l-lh0"
    | "text-3xs-l-lh1"
    | "text-3xs-l-lh2"
    | "text-3xs-l-lh3"
    | "text-3xs-r"
    | "text-3xs-r-lh0"
    | "text-3xs-r-lh1"
    | "text-3xs-r-lh2"
    | "text-3xs-r-lh3"
    | "text-3xs-m"
    | "text-3xs-m-lh0"
    | "text-3xs-m-lh1"
    | "text-3xs-m-lh2"
    | "text-3xs-m-lh3"
    | "text-3xs-bo"
    | "text-3xs-bo-lh0"
    | "text-3xs-bo-lh1"
    | "text-3xs-bo-lh2"
    | "text-3xs-bo-lh3"
    | "text-3xs-h"
    | "text-3xs-h-lh0"
    | "text-3xs-h-lh1"
    | "text-3xs-h-lh2"
    | "text-3xs-h-lh3"
    | "text-3xs-bl"
    | "text-3xs-bl-lh0"
    | "text-3xs-bl-lh1"
    | "text-3xs-bl-lh2"
    | "text-3xs-bl-lh3"
    | "text-xxs"
    | "text-xxs-lh0"
    | "text-xxs-lh1"
    | "text-xxs-lh2"
    | "text-xxs-lh3"
    | "text-xxs-t"
    | "text-xxs-t-lh0"
    | "text-xxs-t-lh1"
    | "text-xxs-t-lh2"
    | "text-xxs-t-lh3"
    | "text-xxs-l"
    | "text-xxs-l-lh0"
    | "text-xxs-l-lh1"
    | "text-xxs-l-lh2"
    | "text-xxs-l-lh3"
    | "text-xxs-r"
    | "text-xxs-r-lh0"
    | "text-xxs-r-lh1"
    | "text-xxs-r-lh2"
    | "text-xxs-r-lh3"
    | "text-xxs-m"
    | "text-xxs-m-lh0"
    | "text-xxs-m-lh1"
    | "text-xxs-m-lh2"
    | "text-xxs-m-lh3"
    | "text-xxs-bo"
    | "text-xxs-bo-lh0"
    | "text-xxs-bo-lh1"
    | "text-xxs-bo-lh2"
    | "text-xxs-bo-lh3"
    | "text-xxs-h"
    | "text-xxs-h-lh0"
    | "text-xxs-h-lh1"
    | "text-xxs-h-lh2"
    | "text-xxs-h-lh3"
    | "text-xxs-bl"
    | "text-xxs-bl-lh0"
    | "text-xxs-bl-lh1"
    | "text-xxs-bl-lh2"
    | "text-xxs-bl-lh3"
    | "text-xs"
    | "text-xs-lh0"
    | "text-xs-lh1"
    | "text-xs-lh2"
    | "text-xs-lh3"
    | "text-xs-t"
    | "text-xs-t-lh0"
    | "text-xs-t-lh1"
    | "text-xs-t-lh2"
    | "text-xs-t-lh3"
    | "text-xs-l"
    | "text-xs-l-lh0"
    | "text-xs-l-lh1"
    | "text-xs-l-lh2"
    | "text-xs-l-lh3"
    | "text-xs-r"
    | "text-xs-r-lh0"
    | "text-xs-r-lh1"
    | "text-xs-r-lh2"
    | "text-xs-r-lh3"
    | "text-xs-m"
    | "text-xs-m-lh0"
    | "text-xs-m-lh1"
    | "text-xs-m-lh2"
    | "text-xs-m-lh3"
    | "text-xs-bo"
    | "text-xs-bo-lh0"
    | "text-xs-bo-lh1"
    | "text-xs-bo-lh2"
    | "text-xs-bo-lh3"
    | "text-xs-h"
    | "text-xs-h-lh0"
    | "text-xs-h-lh1"
    | "text-xs-h-lh2"
    | "text-xs-h-lh3"
    | "text-xs-bl"
    | "text-xs-bl-lh0"
    | "text-xs-bl-lh1"
    | "text-xs-bl-lh2"
    | "text-xs-bl-lh3"
    | "text-sm"
    | "text-sm-lh0"
    | "text-sm-lh1"
    | "text-sm-lh2"
    | "text-sm-lh3"
    | "text-sm-t"
    | "text-sm-t-lh0"
    | "text-sm-t-lh1"
    | "text-sm-t-lh2"
    | "text-sm-t-lh3"
    | "text-sm-l"
    | "text-sm-l-lh0"
    | "text-sm-l-lh1"
    | "text-sm-l-lh2"
    | "text-sm-l-lh3"
    | "text-sm-r"
    | "text-sm-r-lh0"
    | "text-sm-r-lh1"
    | "text-sm-r-lh2"
    | "text-sm-r-lh3"
    | "text-sm-m"
    | "text-sm-m-lh0"
    | "text-sm-m-lh1"
    | "text-sm-m-lh2"
    | "text-sm-m-lh3"
    | "text-sm-bo"
    | "text-sm-bo-lh0"
    | "text-sm-bo-lh1"
    | "text-sm-bo-lh2"
    | "text-sm-bo-lh3"
    | "text-sm-h"
    | "text-sm-h-lh0"
    | "text-sm-h-lh1"
    | "text-sm-h-lh2"
    | "text-sm-h-lh3"
    | "text-sm-bl"
    | "text-sm-bl-lh0"
    | "text-sm-bl-lh1"
    | "text-sm-bl-lh2"
    | "text-sm-bl-lh3"
    | "text-md"
    | "text-md-lh0"
    | "text-md-lh1"
    | "text-md-lh2"
    | "text-md-lh3"
    | "text-md-t"
    | "text-md-t-lh0"
    | "text-md-t-lh1"
    | "text-md-t-lh2"
    | "text-md-t-lh3"
    | "text-md-l"
    | "text-md-l-lh0"
    | "text-md-l-lh1"
    | "text-md-l-lh2"
    | "text-md-l-lh3"
    | "text-md-r"
    | "text-md-r-lh0"
    | "text-md-r-lh1"
    | "text-md-r-lh2"
    | "text-md-r-lh3"
    | "text-md-m"
    | "text-md-m-lh0"
    | "text-md-m-lh1"
    | "text-md-m-lh2"
    | "text-md-m-lh3"
    | "text-md-bo"
    | "text-md-bo-lh0"
    | "text-md-bo-lh1"
    | "text-md-bo-lh2"
    | "text-md-bo-lh3"
    | "text-md-h"
    | "text-md-h-lh0"
    | "text-md-h-lh1"
    | "text-md-h-lh2"
    | "text-md-h-lh3"
    | "text-md-bl"
    | "text-md-bl-lh0"
    | "text-md-bl-lh1"
    | "text-md-bl-lh2"
    | "text-md-bl-lh3"
    | "text-lg"
    | "text-lg-lh0"
    | "text-lg-lh1"
    | "text-lg-lh2"
    | "text-lg-lh3"
    | "text-lg-t"
    | "text-lg-t-lh0"
    | "text-lg-t-lh1"
    | "text-lg-t-lh2"
    | "text-lg-t-lh3"
    | "text-lg-l"
    | "text-lg-l-lh0"
    | "text-lg-l-lh1"
    | "text-lg-l-lh2"
    | "text-lg-l-lh3"
    | "text-lg-r"
    | "text-lg-r-lh0"
    | "text-lg-r-lh1"
    | "text-lg-r-lh2"
    | "text-lg-r-lh3"
    | "text-lg-m"
    | "text-lg-m-lh0"
    | "text-lg-m-lh1"
    | "text-lg-m-lh2"
    | "text-lg-m-lh3"
    | "text-lg-bo"
    | "text-lg-bo-lh0"
    | "text-lg-bo-lh1"
    | "text-lg-bo-lh2"
    | "text-lg-bo-lh3"
    | "text-lg-h"
    | "text-lg-h-lh0"
    | "text-lg-h-lh1"
    | "text-lg-h-lh2"
    | "text-lg-h-lh3"
    | "text-lg-bl"
    | "text-lg-bl-lh0"
    | "text-lg-bl-lh1"
    | "text-lg-bl-lh2"
    | "text-lg-bl-lh3"
    | "text-xl"
    | "text-xl-lh0"
    | "text-xl-lh1"
    | "text-xl-lh2"
    | "text-xl-lh3"
    | "text-xl-t"
    | "text-xl-t-lh0"
    | "text-xl-t-lh1"
    | "text-xl-t-lh2"
    | "text-xl-t-lh3"
    | "text-xl-l"
    | "text-xl-l-lh0"
    | "text-xl-l-lh1"
    | "text-xl-l-lh2"
    | "text-xl-l-lh3"
    | "text-xl-r"
    | "text-xl-r-lh0"
    | "text-xl-r-lh1"
    | "text-xl-r-lh2"
    | "text-xl-r-lh3"
    | "text-xl-m"
    | "text-xl-m-lh0"
    | "text-xl-m-lh1"
    | "text-xl-m-lh2"
    | "text-xl-m-lh3"
    | "text-xl-bo"
    | "text-xl-bo-lh0"
    | "text-xl-bo-lh1"
    | "text-xl-bo-lh2"
    | "text-xl-bo-lh3"
    | "text-xl-h"
    | "text-xl-h-lh0"
    | "text-xl-h-lh1"
    | "text-xl-h-lh2"
    | "text-xl-h-lh3"
    | "text-xl-bl"
    | "text-xl-bl-lh0"
    | "text-xl-bl-lh1"
    | "text-xl-bl-lh2"
    | "text-xl-bl-lh3"
    | "text-xxl"
    | "text-xxl-lh0"
    | "text-xxl-lh1"
    | "text-xxl-lh2"
    | "text-xxl-lh3"
    | "text-xxl-t"
    | "text-xxl-t-lh0"
    | "text-xxl-t-lh1"
    | "text-xxl-t-lh2"
    | "text-xxl-t-lh3"
    | "text-xxl-l"
    | "text-xxl-l-lh0"
    | "text-xxl-l-lh1"
    | "text-xxl-l-lh2"
    | "text-xxl-l-lh3"
    | "text-xxl-r"
    | "text-xxl-r-lh0"
    | "text-xxl-r-lh1"
    | "text-xxl-r-lh2"
    | "text-xxl-r-lh3"
    | "text-xxl-m"
    | "text-xxl-m-lh0"
    | "text-xxl-m-lh1"
    | "text-xxl-m-lh2"
    | "text-xxl-m-lh3"
    | "text-xxl-bo"
    | "text-xxl-bo-lh0"
    | "text-xxl-bo-lh1"
    | "text-xxl-bo-lh2"
    | "text-xxl-bo-lh3"
    | "text-xxl-h"
    | "text-xxl-h-lh0"
    | "text-xxl-h-lh1"
    | "text-xxl-h-lh2"
    | "text-xxl-h-lh3"
    | "text-xxl-bl"
    | "text-xxl-bl-lh0"
    | "text-xxl-bl-lh1"
    | "text-xxl-bl-lh2"
    | "text-xxl-bl-lh3"
    | "text-3xl"
    | "text-3xl-lh0"
    | "text-3xl-lh1"
    | "text-3xl-lh2"
    | "text-3xl-lh3"
    | "text-3xl-t"
    | "text-3xl-t-lh0"
    | "text-3xl-t-lh1"
    | "text-3xl-t-lh2"
    | "text-3xl-t-lh3"
    | "text-3xl-l"
    | "text-3xl-l-lh0"
    | "text-3xl-l-lh1"
    | "text-3xl-l-lh2"
    | "text-3xl-l-lh3"
    | "text-3xl-r"
    | "text-3xl-r-lh0"
    | "text-3xl-r-lh1"
    | "text-3xl-r-lh2"
    | "text-3xl-r-lh3"
    | "text-3xl-m"
    | "text-3xl-m-lh0"
    | "text-3xl-m-lh1"
    | "text-3xl-m-lh2"
    | "text-3xl-m-lh3"
    | "text-3xl-bo"
    | "text-3xl-bo-lh0"
    | "text-3xl-bo-lh1"
    | "text-3xl-bo-lh2"
    | "text-3xl-bo-lh3"
    | "text-3xl-h"
    | "text-3xl-h-lh0"
    | "text-3xl-h-lh1"
    | "text-3xl-h-lh2"
    | "text-3xl-h-lh3"
    | "text-3xl-bl"
    | "text-3xl-bl-lh0"
    | "text-3xl-bl-lh1"
    | "text-3xl-bl-lh2"
    | "text-3xl-bl-lh3"
    | "text-4xl"
    | "text-4xl-lh0"
    | "text-4xl-lh1"
    | "text-4xl-lh2"
    | "text-4xl-lh3"
    | "text-4xl-t"
    | "text-4xl-t-lh0"
    | "text-4xl-t-lh1"
    | "text-4xl-t-lh2"
    | "text-4xl-t-lh3"
    | "text-4xl-l"
    | "text-4xl-l-lh0"
    | "text-4xl-l-lh1"
    | "text-4xl-l-lh2"
    | "text-4xl-l-lh3"
    | "text-4xl-r"
    | "text-4xl-r-lh0"
    | "text-4xl-r-lh1"
    | "text-4xl-r-lh2"
    | "text-4xl-r-lh3"
    | "text-4xl-m"
    | "text-4xl-m-lh0"
    | "text-4xl-m-lh1"
    | "text-4xl-m-lh2"
    | "text-4xl-m-lh3"
    | "text-4xl-bo"
    | "text-4xl-bo-lh0"
    | "text-4xl-bo-lh1"
    | "text-4xl-bo-lh2"
    | "text-4xl-bo-lh3"
    | "text-4xl-h"
    | "text-4xl-h-lh0"
    | "text-4xl-h-lh1"
    | "text-4xl-h-lh2"
    | "text-4xl-h-lh3"
    | "text-4xl-bl"
    | "text-4xl-bl-lh0"
    | "text-4xl-bl-lh1"
    | "text-4xl-bl-lh2"
    | "text-4xl-bl-lh3"

const getTypography = () => {

    const res: any = {}

    const WEIGHT_TYPES_CUSTOM: {
        [key: string]: TextStyle;
    } = {
        THIN: {
            fontWeight: '200',
            fontFamily: FONT_FAMILY.regular
        },
        LIGHT: {
            fontWeight: '300',
            fontFamily: FONT_FAMILY.regular
        },
        REGULAR: {
            fontWeight: '400',
            fontFamily: FONT_FAMILY.regular
        },
        MEDIUM: {
            //fontWeight: Constants.isIOS ? '500' : '700',
            fontWeight: '500',
            fontFamily: FONT_FAMILY.medium
        },
        BOLD: {
            //fontWeight: Constants.isIOS ? '600' : '700',
            fontWeight: '600',
            fontFamily: FONT_FAMILY.bold
        },
        HEAVY: {
            fontWeight: '800',
            fontFamily: FONT_FAMILY.bold
        },
        BLACK: {
            fontWeight: '900',
            fontFamily: FONT_FAMILY.bold
        },
    };

    const lineHeightRatio = 1.3

    const fontSizes = {
        'text-4xs': {
            fontSize: 10,
            lineHeightRatio,
        },
        'text-3xs': {
            fontSize: 11,
            lineHeightRatio
        },
        'text-xxs': {
            fontSize: 12,
            lineHeightRatio
        },
        'text-xs': {
            fontSize: 13,
            lineHeightRatio
        },
        'text-sm': {
            fontSize: 14,
            lineHeightRatio
        },
        'text-md': {
            fontSize: 15,
            lineHeightRatio
        },
        'text-lg': {
            fontSize: 16,
            lineHeightRatio
        },
        'text-xl': {
            fontSize: 17,
            lineHeightRatio
        },
        'text-xxl': {
            fontSize: 19,
            lineHeightRatio
        },
        'text-3xl': {
            fontSize: 22,
            lineHeightRatio
        },
        'text-4xl': {
            fontSize: 25,
            lineHeightRatio
        },
    }

    const weightsMap = {
        THIN: 'T',
        LIGHT: 'L',
        REGULAR: 'R',
        MEDIUM: 'M',
        BOLD: 'BO',
        HEAVY: 'H',
        BLACK: 'BL'
    };

    for (const [sizeName, _typo] of Object.entries(fontSizes)) {

        const typo = {
            ...WEIGHT_TYPES_CUSTOM.REGULAR,
            ...scaleFont(_typo),
        }

        let fontSize = typo.fontSize

        res[sizeName] = {...typo}

        res[sizeName + '-lh0'] = {...typo, lineHeight: fontSize}
        res[sizeName + '-lh1'] = {...typo, lineHeight: fontSize * 1.1}
        res[sizeName + '-lh2'] = {...typo, lineHeight: fontSize * 1.2}
        res[sizeName + '-lh3'] = {...typo, lineHeight: fontSize * 1.3}

        for (const [weightName, weightStr] of Object.entries(weightsMap)) {

            const fontWeightStyle = WEIGHT_TYPES_CUSTOM[weightName]

            const name = sizeName + '-' + weightStr.toLowerCase()

            res[name] = {...typo, ...fontWeightStyle}
            res[name + '-lh0'] = {...typo, lineHeight: fontSize, ...fontWeightStyle}
            res[name + '-lh1'] = {...typo, lineHeight: fontSize * 1.1, ...fontWeightStyle}
            res[name + '-lh2'] = {...typo, lineHeight: fontSize * 1.2, ...fontWeightStyle}
            res[name + '-lh3'] = {...typo, lineHeight: fontSize * 1.3, ...fontWeightStyle}
        }
    }

    return res as Record<TTypographyName, TextStyle & ViewStyle>
}

export const TYPOGRAPHY = getTypography()

export const THEME_COLORS = {

    colorAspid: '#2c525d',

    primary: '#D16837',
    primaryLight: '#e1865f',
    primaryLighter: '#f3a079',
    primaryLightest: '#ecb8a1',

    secondaryDark: '#14678c',
    secondary: '#2b8fbe',
    secondaryLight: '#84c9ef',
    success: '#469c57',
    accent: '#fed330',
    bgGrey: '#EEEEEE',

    greyCommon: '#EEEEEE',
    danger: Colors.red20,

    _black: Colors.rgba(20, 20, 20, 1) as string,
    _white: Colors.rgba(250, 250, 250, 1) as string,
}

export const COLORS = Colors as (typeof Colors & typeof THEME_COLORS)

export const configureDesignSystem = () => {

    const borderRadius: any = {}

    for (const [size, value] of Object.entries(BORDER_RADIUS)) {
        borderRadius['br-' + size] = value
    }

    BorderRadiuses.loadBorders(borderRadius);

    Spacings.loadSpacings({
        'xs': 4,
        'sm': 8,
        'md': 16,
        'lg': 24,
        'xl': 32,
        'screenV': 16,
        'screenH': 16,
        'modalV': 16,
        'modalH': 16,
    })

    Colors.loadColors(THEME_COLORS as any)

    Colors.loadSchemes({
        light: {
            screenBG: '#FF00000',
            textColor: COLORS.grey10,
            moonOrSun: COLORS.yellow30,
            mountainForeground: COLORS.green30,
            mountainBackground: COLORS.green50
        },
        dark: {
            screenBG: '#FF00000',
            textColor: COLORS._white,
            moonOrSun: COLORS.grey80,
            mountainForeground: COLORS.violet10,
            mountainBackground: COLORS.violet20
        }
    });

    Typography.loadTypographies(TYPOGRAPHY);

    Object.keys(TYPOGRAPHY).forEach((key) => {
        // @ts-ignore
        Typography[key] = TYPOGRAPHY[key]
    })

    ThemeManager.setComponentTheme('View', (props: any, context: any) => {
        const res: any = {
            style: {}
        }
        if (props['marginL-auto'])
            res.style.marginLeft = 'auto'
        if (props['marginR-auto'])
            res.style.marginRight = 'auto'
        if (props['z100'])
            res.style.zIndex = 100
        if (props['wrap']) {
            res.style.flexWrap = 'wrap'
            delete props['wrap']
        }

        return res
    })

    ThemeManager.setComponentTheme('Text', (props: any, context: any) => {
        const res: any = {
            'text-md-r': true,
            style: {}
        }
        if (props['marginL-auto'])
            res.style.marginLeft = 'auto'
        if (props['marginR-auto'])
            res.style.marginRight = 'auto'
        return res
    })


    ThemeManager.setComponentTheme('Button', (props: any, context: any) => {


        const newProps = {
            backgroundColor: props.outline ? '#FFFFFF' : COLORS.primary,
            outlineColor: props.outline ? COLORS.primary : COLORS.primary,
            linkColor: props.link ? COLORS.primary : null,
        }

        return newProps
    })
}

export const wHeight = Dimensions.get('window').height;
export const wWidth = Dimensions.get('window').width;

export const grid = StyleSheet.create({
    col_1_3: {
        flex: 0.333
    },
    col_5_12: {
        flex: 0.416
    },
    col_9_24: {
        flex: 0.375
    },
    col_1_4: {
        flex: 0.25
    },
    col_1_2: {
        width: 0.5
    }
})

export const getModifiersStyle = (preset?: string[] | string | null, flatten = false) => {

    const res = toArray(preset).reduce((map, p) => {

        if (Typography[p as keyof typeof Typography]) {
            map.push(Typography[p as keyof typeof Typography])
        }

        if (COLORS[p as keyof typeof COLORS]) {
            map.push({
                color: COLORS[p as keyof typeof COLORS]
            })
        }
        return map
    }, [])

    return flatten ? StyleSheet.flatten(res) : res
}

export const generateModifiersStyle = (props: any) => {
    const items = Modifiers.generateModifiersStyle({paddings: true, margins: true}, props || {})
    return items ? Object.values(items).reduce((map, item) => {
        map = {
            ...map,
            ...item
        }
        return map
    }, {}) : []
}

export const THEME = {
    screen: {
        common: {
            backgroundColor: '#eeeeee'
        }
    },
    btnRadius: 14,
    screenPaddingH: 16,
    screenPaddingV: 16,
    separatorColor: COLORS.grey60,

    border: {
        color: {
            darkest: '#666666',
            darker: '#999999',
            dark: '#AAAAAA',
            default: '#CCCCCC',
            light: '#EEEEEE',
            lighter: '#EFEFEF',
        },
    },
    borderRadiusDef: 16,
}

export const THEME_STYLE = StyleSheet.create({
    borderDefault: {
        borderColor: THEME.border.color.default,
        borderWidth: 1,
        borderRadius: 16
    },
    borderAccent: {
        borderColor: THEME.border.color.darker,
        borderWidth: 1,
        borderRadius: 16
    },
    screenPaddingH: {
        paddingHorizontal: THEME.screenPaddingH
    },
    screenPaddingV: {
        paddingVertical: THEME.screenPaddingV
    },
    screenPadding: {
        paddingVertical: THEME.screenPaddingV,
        paddingHorizontal: THEME.screenPaddingH,
    },
    shadow1: {
        shadowColor: "#777777",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 4,
    },
    shadow2: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
        elevation: 2,
    },
})

export const SPACE = "\u00A0"

export const getHeightRelFrame = (props: {
    min?: number,
    max?: number,
    percent?: number,
    frameHeight?: number
} = {}) => {
    const {
        min = 100,
        max = 1000,
        percent = 50,
        frameHeight = wHeight,
    } = props
    let res = percent * frameHeight / 100
    if (min && res < min) {
        res = min
    }
    if (max && res > max) {
        res = max
    }
    return res
}


export const roundStyle = (size: number) => {
    return {
        width: size,
        height: size,
        borderRadius: Math.round(size / 2),
    }
}

const getCatalogTabbarSizes = () => {
    const CATALOG_TABBAR_ICON_HEIGHT = 20

    const CATALOG_TABBAR_ITEM_PADDING_VERTICAL = verticalScale(17)
    const CATALOG_TABBAR_ITEM_PADDING_HORIZONTAL = 6
    const CATALOG_TABBAR_ITEM_MARGIN_HORIZONTAL = 4

    const CATALOG_TABBAR_LABEL_PADDING_TOP = 2
    const CATALOG_TABBAR_LABEL_PADDING_BOTTOM = 0
    const CATALOG_TABBAR_LABEL_MARGIN_VERTICAL = 0
    const CATALOG_TABBAR_LABEL_MARGIN_HORIZONTAL = 0
    const CATALOG_TABBAR_LABEL_FONT_SIZE = TYPOGRAPHY['text-sm-bo-lh0'].fontSize || 0

    const CATALOG_TABBAR_LABEL_HEIGHT =
        CATALOG_TABBAR_LABEL_FONT_SIZE +
        CATALOG_TABBAR_LABEL_PADDING_TOP +
        CATALOG_TABBAR_LABEL_PADDING_BOTTOM +
        CATALOG_TABBAR_LABEL_MARGIN_VERTICAL * 2

    const CATALOG_TABBAR_ITEM_INNER_HEIGHT = Math.max(CATALOG_TABBAR_ICON_HEIGHT, CATALOG_TABBAR_LABEL_HEIGHT)

    const CATALOG_TABBAR_ITEM_HEIGHT = CATALOG_TABBAR_ITEM_PADDING_VERTICAL * 2 + CATALOG_TABBAR_ITEM_INNER_HEIGHT

    const CATALOG_TABBAR_HEIGHT = CATALOG_TABBAR_ITEM_HEIGHT

    const CATALOG_TABBAR_INDICATOR_CONTAINER_MARGIN_VERTICAL = (CATALOG_TABBAR_ITEM_HEIGHT - CATALOG_TABBAR_ITEM_INNER_HEIGHT) / 2 - 3

    return {
        CATALOG_TABBAR_HEIGHT,
        CATALOG_TABBAR_ITEM_HEIGHT,
        CATALOG_TABBAR_ITEM_INNER_HEIGHT,
        CATALOG_TABBAR_LABEL_HEIGHT,
        CATALOG_TABBAR_LABEL_FONT_SIZE,
        CATALOG_TABBAR_LABEL_PADDING_TOP,
        CATALOG_TABBAR_LABEL_PADDING_BOTTOM,
        CATALOG_TABBAR_LABEL_MARGIN_VERTICAL,
        CATALOG_TABBAR_LABEL_MARGIN_HORIZONTAL,
        CATALOG_TABBAR_ITEM_PADDING_VERTICAL,
        CATALOG_TABBAR_ITEM_PADDING_HORIZONTAL,
        CATALOG_TABBAR_ITEM_MARGIN_HORIZONTAL,
        CATALOG_TABBAR_ICON_HEIGHT,
        CATALOG_TABBAR_INDICATOR_CONTAINER_MARGIN_VERTICAL
    }
}

export const CATALOG_TABBAR_SIZES = getCatalogTabbarSizes()

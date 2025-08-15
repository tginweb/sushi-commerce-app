import React, {useMemo} from "react"
import {RadioButton, Text, TouchableOpacity, View} from "react-native-ui-lib"
import {RecursiveArray, TextStyle, ViewStyle} from "react-native"
import {TBuildableComponentProps, TIconProps, TPresetName} from "@core/main/types"
import {ViewProps} from "react-native-ui-lib/src/components/view"
import {TouchableOpacityProps} from "react-native-ui-lib/src/components/touchableOpacity"
import {UiBtnProps} from "~ui/btn";
import {UiActions} from "~ui/actions";
import {COLORS, getModifiersStyle} from "~assets/design";

import {presets, styles} from "./index.styles";
import {RadioButtonProps} from "react-native-ui-lib/src/components/radioButton";
import {isScalar} from "@core/main/util/base/isScalar";
import icons from "~assets/icons-map"
import {UiBadge, UiBadgeProps} from "~ui/badge";
import {ActionMobile, Condition} from "~gql/api";
import {useStores} from "~stores";
import {UiBuildable} from "~ui/buildable";
import {iconResolve} from "~ui/icon-resolver";
import {TouchableWithoutFeedback} from "react-native-gesture-handler";
import applyPresets from "@core/main/util/react/applyPresets";

export type UiListItemProps = TBuildableComponentProps & {
    datasources?: any
    condition?: Condition[]
    itemsRef?: any
    itemsRefId?: any
    label?: any
    caption?: string
    content?: any
    value?: any
    data?: any
    action?: ActionMobile
    contentSuffix?: any
    contentWrap?: boolean
    icon?: any
    iconProps?: TIconProps
    preset?: TPresetName
    isFirst?: boolean
    isLast?: boolean
    iconPlaceholder?: boolean
    backgroundColor?: string
    textPreset?: string[] | string
    labelTextPreset?: string[] | string
    contentTextPreset?: string[] | string
    onPress?: (item: UiListItemProps) => void
    onLongPress?: (item: UiListItemProps) => void
    onRadioPress?: (item: UiListItemProps) => void
    selected?: boolean
    sideSlot?: any
    radio?: boolean | RadioButtonProps
    rightButtons?: UiBtnProps[]
    route?: any
    routeBehavior?: 'push' | 'replace'
    badge?: UiBadgeProps | null
    hidden?: boolean
    showMore?: boolean
    withoutFeedback?: boolean
    elementsStyle?: {
        container?: ViewStyle
        caption?: TextStyle
        content?: ViewStyle
    }
}

export const UiListItemComponent: React.FC<UiListItemProps> = (props) => {

    const {menu, router} = useStores()

    const {
        itemsRef,
        itemsRefId,
        isFirst,
        isLast,
        label,
        caption,
        content,
        contentSuffix,
        icon,
        iconProps = {},
        preset,
        iconPlaceholder = false,
        backgroundColor,
        textPreset,
        labelTextPreset,
        contentTextPreset,
        onPress,
        onLongPress,
        action,
        onRadioPress,
        sideSlot,
        rightButtons,
        value,
        contentWrap,
        radio,
        selected,
        route,
        badge,
        hidden,
        showMore = null,
        elementsStyle = {},
        withoutFeedback
    } = props

    const presetRes = applyPresets(props, preset, presets)

    let _onPress: (() => void) | null = null

    let _onLongPress = onLongPress ? () => {
        onLongPress && onLongPress(props)
    } : null

    if (action) {
        _onPress = () => {
            menu.runActionItem(action)
            onPress && onPress(props)
        }
    } else if (route) {
        _onPress = () => {
            route && router.push(route)
            onPress && onPress(props)
        }
    } else if (onPress) {
        _onPress = () => onPress(props)
    }

    const _preassable = onPress || action || route

    const _iconProps = {
        size: 20,
        ...(presetRes.icon || {}),
        ...(selected && presetRes.iconSelected ? presetRes.iconSelected : {}),
        ...iconProps,
    }

    const containerStyle: ViewStyle = {}

    if (backgroundColor) {
        containerStyle.backgroundColor = backgroundColor
    }

    const cstyle: {
        container: RecursiveArray<ViewStyle>,
        cell: RecursiveArray<ViewStyle>,
        mainCell: RecursiveArray<ViewStyle>,
        radioCell: RecursiveArray<ViewStyle>,
        radio: RecursiveArray<ViewStyle>,
        icon: RecursiveArray<ViewStyle>,
        iconCell: RecursiveArray<ViewStyle>,
        main: RecursiveArray<ViewStyle>,
        info: RecursiveArray<ViewStyle>,
        label: RecursiveArray<ViewStyle>,
        caption: RecursiveArray<ViewStyle>,
        content: RecursiveArray<ViewStyle>,
        contentText: RecursiveArray<ViewStyle>,
        contentTextWrap: RecursiveArray<ViewStyle>,
        sideCell: RecursiveArray<ViewStyle>,
        rightButtonsCell: RecursiveArray<ViewStyle>,
        rightButtons: RecursiveArray<ViewStyle>,
        mainCellFirstChild: RecursiveArray<ViewStyle>,
        mainCellLastChild: RecursiveArray<ViewStyle>,
        mainWrap: RecursiveArray<ViewStyle>,
        more: RecursiveArray<ViewStyle>,
    } = {
        container: [],
        radioCell: [],
        mainCell: [],
        cell: [],
        radio: [],
        iconCell: [],
        main: [],
        icon: [],
        info: [],
        label: [],
        caption: [],
        content: [],
        contentText: [],
        contentTextWrap: [],
        sideCell: [],
        rightButtonsCell: [],
        rightButtons: [],
        mainCellFirstChild: [],
        mainCellLastChild: [],
        mainWrap: [],
        more: []
    }

    for (let part in cstyle) {
        cstyle[part as keyof typeof cstyle] = [
            styles[part as keyof typeof styles],
            ...(presetRes.styles[part] || []),
            ...(isFirst ? presetRes.styles[part + 'First'] || [] : []),
            ...(isLast ? presetRes.styles[part + 'Last'] || [] : []),
            // @ts-ignore
            (elementsStyle[part] || []),
            ...(selected ? presetRes.styles[part + 'Selected'] || [] : []),
            ...(_onPress ? presetRes.styles[part + 'Pressable'] || [] : []),
        ].filter(v => !!v)
    }

    if (textPreset) {
        cstyle.label = [...(cstyle.label as Array<any>), getModifiersStyle(textPreset)]
        cstyle.contentText = [...(cstyle.contentText as Array<any>), getModifiersStyle(textPreset)]
    }

    if (labelTextPreset) {
        cstyle.label = [...(cstyle.label as Array<any>), getModifiersStyle(labelTextPreset)]
    }

    if (contentTextPreset) {
        cstyle.contentText = [...(cstyle.contentText as Array<any>), getModifiersStyle(contentTextPreset)]
    }

    let Wrapper, wrapperProps = {}

    if (_onPress || onLongPress) {
        Wrapper = withoutFeedback ? TouchableWithoutFeedback : TouchableOpacity
        wrapperProps = {
            onPress: _onPress,
            onLongPress: _onLongPress
        } as TouchableOpacityProps
    } else {
        Wrapper = View
        wrapperProps = {} as ViewProps
    }

    let comContent = useMemo(() => {

        if (!content) return null

        let res

        if (typeof content == "function") {
            res = content(cstyle)
        } else if (isScalar(content)) {
            res = <Text style={[cstyle.contentText, contentWrap && cstyle.contentTextWrap]}>
                {content.toString()}
                {contentSuffix ? contentSuffix.toString() : ''}
            </Text>
        } else if (Array.isArray(content)) {
            res = content.map((val, index) =>
                <Text key={index} style={cstyle.contentText}>
                    {val}
                    {contentSuffix ? contentSuffix.toString() : ''}
                </Text>
            )
        } else {
            res = content
        }
        return <View style={cstyle.content}>{res}</View>
    }, [content, selected])

    const comInfo = useMemo(() => {

        let labelView

        if (typeof label == "function") {
            labelView = label(cstyle)
        } else if (isScalar(label)) {
            labelView = <Text style={cstyle.label}>
                {label}
            </Text>
        } else {
            labelView = label
        }

        return <View style={cstyle.info}>
            {labelView}
            {!!caption && <Text style={cstyle.caption}>
                {caption}
            </Text>}
        </View>
    }, [label, caption, selected])

    const comIcon = useMemo(() => {
        if (!iconPlaceholder && !icon) return null
        return <View style={cstyle.iconCell}>
            {icon ? iconResolve(icon, _iconProps) : null}
        </View>
    }, [icon, selected])

    const comRightButtons = useMemo(() => {
        if (!rightButtons || !rightButtons.length) return null
        return <View style={[...cstyle.cell, ...cstyle.rightButtonsCell]}>
            <UiActions
                containerStyle={cstyle.rightButtons}
                items={rightButtons}
            />
        </View>
    }, [rightButtons, selected])

    const comSide = useMemo(() => {

        if (
            !sideSlot &&
            !badge &&
            !showMore &&
            (!rightButtons || !rightButtons.length) &&
            (!_preassable || showMore === false)
        ) return null

        return <View style={[...cstyle.cell, ...cstyle.sideCell]}>

            {sideSlot}

            {!!badge && <UiBadge
                backgroundColor={COLORS.primary}
                size={24}
                {...badge}
            />}

            {comRightButtons}

            {
                !!_onPress && showMore !== false && <View style={cstyle.more}>
                    {icons.angleRight({color: COLORS.primary, size: 20})}
                </View>
            }

        </View>
    }, [sideSlot, rightButtons, badge, selected, _onPress])

    if (hidden)
        return <></>

    return <Wrapper
        {...wrapperProps}
        style={[cstyle.container, containerStyle]}
        ref={(r: any) => {
            if (itemsRef && itemsRef.current) {
                itemsRef.current[itemsRefId || value] = r
            }
        }}
    >
        {radio && (<View style={[...cstyle.cell, ...cstyle.radioCell]}>
            <RadioButton
                color={selected ? COLORS.primary : COLORS.grey50}
                containerStyle={cstyle.radio}
                size={18}
                onPress={() => {
                    if (onRadioPress) {
                        onRadioPress(props)
                    } else if (_onPress) {
                        _onPress()
                    }
                }}
                selected={selected}
                {...(typeof radio !== 'boolean' ? radio : {})}
            />
        </View>)}

        <View style={[
            ...cstyle.cell,
            ...cstyle.mainCell,
            !radio && cstyle.mainCellFirstChild,
            (!rightButtons || !rightButtons.length) && cstyle.mainCellLastChild,
        ]}>

            {comIcon}

            <View style={[
                ...cstyle.main,
                ...(contentWrap ? cstyle.mainWrap : [])
            ]}>
                {comInfo}
                {comContent}
            </View>

        </View>

        {comSide}

    </Wrapper>
}

export const UiListItem: React.FC<UiListItemProps> = (props) => {
    return props.templatableProps || props.condition ?
        <UiBuildable
            Component={UiListItemComponent}
            {...props}
        />
        :
        <UiListItemComponent {...props}/>
}

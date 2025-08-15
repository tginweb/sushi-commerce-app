import React, {RefObject, useCallback, useMemo} from "react"
import {
    Keyboard,
    KeyboardAvoidingView,
    LayoutChangeEvent,
    Platform,
    RecursiveArray,
    ScrollView,
    View as NativeView,
    ViewStyle
} from "react-native"
import {View} from "react-native-ui-lib"
import {UiActions} from "~ui/actions"
import {UiLoaderScreen} from "~ui/loader-screen"
import render from "@core/main/util/react/render";
import {UiBtnProps} from "~ui/btn";
import {TLayoutScope, useLayout} from "@core/main/lib/hooks/useLayout";
import {PartialRecord, TComponentable, TComponentTargetProps, TLayoutMeasure, TValign} from "@core/main/types";
import {TBodyEmptyProps, UiBodyEmpty} from "~ui/body-empty";
import {propsFilter} from "@core/main/util/react/propsFilter";
import Animated from "react-native-reanimated";
import {presets, styles} from "./styles";
import {generateModifiersStyle, wHeight} from "~assets/design";
import useKeyboard from "@core/main/lib/hooks/useKeyboard";
import {UiPressable} from "~ui/pressable";
import {useHeaderHeight} from "@react-navigation/elements";
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';

export type TScreenEmbedContext = {
    footerLayout: any,
    footerScrollOffset: number,
    bodyVerticalCenterOffset: number
}

export type TScreenTarget =
    'outer'
    | 'inner'
    | 'container'
    | 'containerInner'
    | 'header'
    | 'footer'
    | 'body'
    | 'bodyEmpty'
    | 'scroll'

type TScreenTargetProps = TComponentTargetProps<TScreenTarget>

export type UiScreenProps = {
    useSafeArea?: boolean
    draggableContent?: boolean
    keyboardAvoidingView?: boolean
    backgroundColor?: string
    onBodyLayoutMeasureChange?: (res: TLayoutMeasure) => void
    onBack?: any
    children?: any
    preset?: keyof typeof presets
    modifiers?: PartialRecord<TScreenTarget, string[]>
    footerAbsolute?: boolean
    topSlot?: any
    footerShowFade?: number

    headerSlot?: TComponentable<TScreenEmbedContext>
    headerSlotInner?: TComponentable<TScreenEmbedContext>
    headerIsFixed?: boolean
    headerAbsolute?: boolean

    bodyLayout?: TLayoutScope
    bodyOnLayout?: boolean | ((e: LayoutChangeEvent) => void)
    bodyOnLayoutDebounced?: boolean | number
    bodyOnContentSizeChange?: boolean | ((w: number, h: number) => void)
    bodyOnLayoutMeasureChange?: (measure: TLayoutMeasure) => void

    bodySlot?: TComponentable<TScreenEmbedContext>
    bodySlotInner?: TComponentable<TScreenEmbedContext>
    bodyValign?: TValign
    bodyScroll?: boolean

    bodyIsEmpty?: boolean
    bodyEmptyValign?: TValign
    bodyEmptyIcon?: any
    bodyEmptySlot?: TComponentable<TBodyEmptyProps>
    bodyEmptyTitle?: string
    bodyEmptyCaption?: string


    footerLayout?: TLayoutScope
    footerOnLayout?: boolean | ((e: LayoutChangeEvent) => void)
    footerOnLayoutDebounced?: boolean | true
    footerOnLayoutMeasureChange?: (measure: TLayoutMeasure) => void
    footerSlot?: TComponentable<TScreenEmbedContext>
    footerSlotInner?: TComponentable<TScreenEmbedContext>
    footerActions?: UiBtnProps[]
    footerActionsContainerStyle?: ViewStyle

    footerTop?: TComponentable<TScreenEmbedContext>
    footerBottom?: TComponentable<TScreenEmbedContext>

    componentsSlot?: any

    loading?: boolean
    loadingShowContent?: boolean
    loadingTitle?: string

    containerTranslateMiddle?: boolean | number

    keyboardAwareScrollExtraHeight?: number
    onPress?: () => void
    limitAreaHeightByKeyboard?: boolean
    keyboardDismissibleView?: boolean
    headerShown?: boolean
}

export const UiScreen: React.FC<UiScreenProps> = (
    {
        useSafeArea = false,
        draggableContent = false,
        keyboardAvoidingView = false,
        backgroundColor,
        onBodyLayoutMeasureChange,
        modifiers,
        preset,
        onBack,
        children,
        footerAbsolute,

        topSlot,

        headerSlot,
        headerSlotInner,
        headerIsFixed = true,
        headerAbsolute = false,

        bodyLayout,
        bodyOnLayout,
        bodyOnLayoutDebounced,
        bodyOnContentSizeChange,
        bodyOnLayoutMeasureChange,

        bodySlot,
        bodySlotInner,
        bodyValign = 'top',
        bodyIsEmpty,

        bodyEmptyValign = 'middle',
        bodyEmptySlot = UiBodyEmpty,
        bodyEmptyIcon,
        bodyEmptyTitle = 'Нет результатов',
        bodyEmptyCaption = '',

        bodyScroll = true,

        footerLayout,
        footerOnLayout,
        footerOnLayoutDebounced,
        footerOnLayoutMeasureChange,
        footerSlot,
        footerSlotInner,
        footerTop,
        footerBottom,
        footerActions,
        footerActionsContainerStyle = {gap: 10},

        componentsSlot,

        loading,
        loadingTitle = 'Загрузка',
        loadingShowContent = false,

        containerTranslateMiddle,
        keyboardAwareScrollExtraHeight,
        onPress,
        limitAreaHeightByKeyboard,
        keyboardDismissibleView = false,
        headerShown = true
    }
) => {

    const refs = {
        inner: React.useRef<Animated.View | null>(null),
        body: React.useRef<ScrollView | NativeView | null>(null),
        footer: React.useRef<NativeView | null>(null),
        header: React.useRef<NativeView | null>(null),
        scrollWrapper: React.useRef<NativeView | null>(null),
    }

    const keyboard = useKeyboard()

    const _bodyLayout = bodyLayout || useLayout(refs.body, {testId: 'screen.body'})
    const _footerLayout = footerLayout || useLayout(refs.footer, {testId: 'screen.footer'})

    const routerHeaderHeight = useHeaderHeight()

    const targetKeys: TScreenTarget[] = ['outer', 'inner', 'container', 'containerInner', 'header', 'footer', 'body', 'bodyEmpty', 'scroll']

    let _modifiers: any = {}

    if (preset) {
        if (presets[preset]) {
            if (presets[preset].targets) {
                _modifiers = {
                    ...presets[preset].targets
                }
            }
        }
    }

    _modifiers = {
        ..._modifiers,
        ...(modifiers || {})
    }

    const target = React.useMemo<TScreenTargetProps>(() => {

        const result: TScreenTargetProps = {} as TScreenTargetProps

        for (const target of targetKeys) {
            result[target] = {
                style: {},
                props: {}
            }
            switch (target) {
                case "body":
                    if (bodyValign) {
                        result.body.style = (styles[('body-valign-' + bodyValign) as keyof typeof styles]) as ViewStyle || {}
                    }
                    break;
                case "bodyEmpty":
                    if (bodyEmptyValign) {
                        result.bodyEmpty.style = (styles[('body-valign-' + bodyEmptyValign) as keyof typeof styles]) as ViewStyle || {}
                    }
                    break;
                case "container":
                    if (backgroundColor) {
                        result.container.style.backgroundColor = backgroundColor
                    }
                    break;
            }

            if (_modifiers && _modifiers[target]) {
                for (const mod of _modifiers[target] as []) {
                    result[target].props[mod] = true as any
                }
            }
        }

        return result
    }, [_modifiers])

    const ctx = {
        footerLayout: _footerLayout,
    }

    let body

    if (bodyIsEmpty)
        body = <View
            flex
            {...target.bodyEmpty.props}
            style={[styles.bodyEmpty, target.bodyEmpty.style]}
        >
            {render<TBodyEmptyProps>(bodyEmptySlot, propsFilter({
                icon: bodyEmptyIcon,
                title: bodyEmptyTitle,
                caption: bodyEmptyCaption
            }))}
        </View>
    else if (bodySlot)
        body = render(bodySlot, ctx)
    else if (bodySlotInner)
        body = render(bodySlotInner, ctx)
    else if (children)
        body = children

    const header = useMemo(() => {

        let inner

        if (headerSlot)
            return render(headerSlot)
        else if (headerSlotInner)
            inner = render(headerSlotInner)

        const style: RecursiveArray<ViewStyle> = [styles.header, target.header.style]

        if (headerAbsolute) {
            style.push(styles.headerAbsolute)
        }

        return inner &&
            <View
                {...target.header.props}
                style={style}
                ref={refs.header}
                // onLayout={headerLayout.onLayout}
            >
                {inner}
            </View>

    }, [headerSlot, headerSlotInner])

    const _footerOnLayout = useCallback((e: LayoutChangeEvent) => {
        if (footerOnLayout) {
            if (footerOnLayout === true) {
                _footerLayout.onLayout(e)
                footerOnLayoutMeasureChange && footerOnLayoutMeasureChange(_footerLayout.measure)
            } else if (typeof footerOnLayout === 'function') {
                footerOnLayout(e)
            }
        }
    }, [footerOnLayout, footerOnLayoutMeasureChange])

    const footer = useMemo(() => {

        let inner

        const _footerActions = footerActions ? footerActions.filter(item => !item.hideOnKeyboard || !keyboard.willShow) : []

        if (footerSlot)
            return render(footerSlot)
        else if (footerSlotInner)
            inner = render(footerSlotInner)
        else if (footerTop || footerBottom || (footerActions && footerActions.length))
            inner = <>
                {render(footerTop)}
                {
                    !!_footerActions.length &&
                    <View>
                        <UiActions
                            items={_footerActions}
                            containerStyle={footerActionsContainerStyle}
                        />
                    </View>
                }
                {render(footerBottom)}
            </>

        const style: RecursiveArray<ViewStyle> = [styles.footer, target.footer.style]

        if (footerAbsolute) {
            style.push(styles.footerAbsolute)
        }

        return inner && <View
            {...target.footer.props}
            style={[
                styles.footer,
                style
            ]}
            ref={_footerLayout.ref as any}
            //onLayout={_footerOnLayout}
        >
            {inner}
        </View>

    }, [
        footerSlot,
        footerSlotInner,
        footerTop,
        footerBottom,
        footerActions,
        keyboard.height,
        footerOnLayout
    ])

    const _bodyOnContentSizeChange = useCallback((w: number, h: number) => {
        if (bodyOnContentSizeChange) {
            if (bodyOnContentSizeChange === true) {
                _bodyLayout?.onContentSizeChange(w, h)
            } else if (typeof bodyOnContentSizeChange === 'function') {
                bodyOnContentSizeChange(w, h)
            }
        }
    }, [bodyOnContentSizeChange])

    const _bodyOnLayout = useCallback((e: LayoutChangeEvent) => {
        if (bodyOnLayout) {
            if (bodyOnLayout === true) {
                _bodyLayout.onLayout(e, bodyOnLayoutMeasureChange)
            } else if (typeof bodyOnLayout === 'function') {
                bodyOnLayout(e)
            }
        }
    }, [bodyOnLayout, bodyOnLayoutMeasureChange])


    const bodyStyle = generateModifiersStyle(target.body.props)

    const isIphoneNew = useMemo(() => {
        return Platform.OS === 'ios' && wHeight > 800
    }, [])

    const _keyboardVerticalOffset = useMemo(() => {
        if (Platform.OS === 'ios') {
            if (isIphoneNew) {
                return 90
            }
            return 50
        } else {
            return 80
        }
    }, [])

    let _onPress = onPress || keyboardDismissibleView ? useCallback(() => {
        onPress && onPress()
        if (keyboardDismissibleView) {
            Keyboard.dismiss()
        }
    }, [onPress, keyboardDismissibleView]) : undefined

    const areaStyle: ViewStyle = {}

    if (limitAreaHeightByKeyboard) {
        if (keyboard.height) {
            areaStyle.height = wHeight - keyboard.height - routerHeaderHeight
        } else {
            areaStyle.flex = 1
        }
    } else {
        areaStyle.flex = 1
    }

    if (!useSafeArea && !headerShown) {
        const insets = useSafeAreaInsets()
        areaStyle.paddingTop = insets.top
    }

    const Holder = useSafeArea ? SafeAreaView : View

    return <Holder style={areaStyle}>

        <UiPressable
            onPress={_onPress}
            style={{flex: 1}}
            withoutFeedback={true}
        >
            {loading && !loadingShowContent ?

                <UiLoaderScreen message={loadingTitle}/>
                :
                <View flex>

                    {loading && <UiLoaderScreen message={loadingTitle} overlay={true}/>}

                    {render(topSlot)}

                    <View
                        {...target.container.props}
                        style={[styles.container, target.container.style]}
                    >
                        <View
                            {...target.containerInner.props}
                            style={[styles.containerInner, target.containerInner.style]}
                            ref={refs.inner}
                        >
                            <KeyboardAvoidingView
                                style={{flexGrow: 1}}
                                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                                enabled={keyboardAvoidingView}
                                keyboardVerticalOffset={_keyboardVerticalOffset}
                            >
                                {header}
                                {
                                    bodyScroll ?
                                        <ScrollView
                                            style={{
                                                flex: 1
                                            }}
                                            contentContainerStyle={[
                                                styles.body,
                                                footerAbsolute ? styles.bodyWithFooterAbsolute : null,
                                                bodyStyle,
                                                target.body.style
                                            ]}
                                            //onLayout={bodyLayout.onLayout}
                                            onContentSizeChange={_bodyOnContentSizeChange}
                                            ref={_bodyLayout.ref as RefObject<ScrollView>}
                                            scrollEnabled={true}
                                        >
                                            {body}
                                        </ScrollView>
                                        :
                                        <View
                                            style={[
                                                styles.body,
                                                footerAbsolute ? styles.bodyWithFooterAbsolute : null,
                                                bodyStyle,
                                                target.body.style,
                                            ]}
                                            onLayout={_bodyOnLayout}
                                            ref={_bodyLayout.ref as RefObject<NativeView>}
                                        >
                                            {body}
                                        </View>
                                }
                                {footer}
                            </KeyboardAvoidingView>
                        </View>
                    </View>
                </View>
            }
        </UiPressable>

        {componentsSlot}

    </Holder>
}


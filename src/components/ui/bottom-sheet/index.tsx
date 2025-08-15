import React, {
    MutableRefObject,
    RefObject,
    useCallback,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
    useState
} from "react"
import {
    LayoutChangeEvent,
    LayoutRectangle,
    ScrollView,
    ScrollViewProps,
    TextStyle,
    TouchableWithoutFeedback,
    View as NativeView,
    ViewStyle
} from "react-native"
import render from "@core/main/util/react/render";
import {LoaderScreen, Modifiers, Text, View} from "react-native-ui-lib"
import {COLORS, wHeight} from "~assets/design"
import {CLOSER_BACK} from "~assets/icons-map"
import {UiBtnProps} from "~ui/btn"
import {UiActions} from "~ui/actions"
import {
    BottomSheetBackdropProps,
    BottomSheetFooter,
    BottomSheetModal as VendorBottomSheetModal,
    BottomSheetModalProps,
    BottomSheetProps,
    BottomSheetScrollView,
    BottomSheetView,
    KEYBOARD_INPUT_MODE
} from "~ui/bottom-sheet-vendor"
import {PartialRecord} from "@core/main/types"
import {useFocusEffect} from "expo-router";
import {TLayoutScope, useLayout} from "@core/main/lib/hooks/useLayout";
import Reanimated, {interpolate, useAnimatedStyle} from "react-native-reanimated";

import {useTargetProps} from "@core/main/lib/hooks/useTargetProps";
import {presets, styles} from "./styles";
import flattenChildren from "react-keyed-flatten-children";
import {useServices} from "~services";
import {useWatch} from "@core/main/lib/hooks/useWatch";
import {BottomSheetModalMethods} from "~ui/bottom-sheet-vendor/types";
import {BottomSheetDefaultFooterProps} from "~ui/bottom-sheet-vendor/components/bottomSheetFooter/types";
import {useDebounceCallback} from "@core/main/lib/hooks/useDebounceCallback";
import {useScreenSize} from "@core/main/lib/hooks/useScreenSize";
import useKeyboard from "@core/main/lib/hooks/useKeyboard";
import useKeyboardAnimatedShow from "@core/main/lib/hooks/useKeyboardAnimatedShow";

const uiLibGenerateModifiersStyle = (props: any) => {
    const items = Modifiers.generateModifiersStyle({paddings: true, margins: true}, props || {})
    return items ? Object.values(items).reduce((map, item) => {
        map = {
            ...map,
            ...item
        }
        return map
    }, {}) : []
}

const targetKeys: TBottomSheetTarget[] = [
    'modal',
    'outer',
    'inner',
    'backdrop',
    'container',
    'containerInner',
    'header',
    'headerImage',
    'footer',
    'footerStatic',
    'footerActions',
    'body',
    'scroll',
    'scrollContent',
    'topbar',
    'topbarLeft',
    'topbarRight',
    'topbarTitle',
]

type TBottomSheetTarget =
    'outer'
    | 'modal'
    | 'inner'
    | 'backdrop'
    | 'container'
    | 'containerInner'
    | 'header'
    | 'headerImage'
    | 'footer'
    | 'footerStatic'
    | 'footerActions'
    | 'body'
    | 'scroll'
    | 'scrollContent'
    | 'topbar'
    | 'topbarLeft'
    | 'topbarRight'
    | 'topbarTitle'

export type TBottomSheetOnClose = (fromDismiss?: boolean, fromAction?: boolean) => void
export type TBottomSheetOnBeforeClose = (fromDismiss?: boolean, fromAction?: boolean) => boolean | void

export type TTopbarSlotProps = {
    titleSlot: any,
    closerSlot: TCloserSlot
}

export type TCloserSlotProps = {
    style?: ViewStyle
}

type TCloserSlot = (props?: TCloserSlotProps) => any

export type UiBottomSheetProps = Omit<BottomSheetModalProps, 'children' | 'topInset' | 'bottomInset'> & {

    fullscreen?: false
    containerOverflowVisible?: boolean
    closeOnRouterBack?: boolean

    useAnomalyInsets?: boolean

    topInset?: number | boolean
    topInsetAdd?: number | boolean

    bottomInset?: number | boolean

    scrollProps?: ScrollViewProps

    id?: string
    backgroundColor?: string

    inspector?: boolean
    maxDynamicContentSize?: number
    isVisible?: boolean
    children?: any
    backdrop?: boolean
    shadow?: boolean
    autoHeight?: boolean
    title?: string | undefined | null
    titleHide?: boolean

    onScroll?: (y: any) => void
    closer?: boolean
    closerPosition?: 'topbar' | 'outsideLeft' | 'outsideRight'

    topbarDeps?: any
    topbarHide?: boolean
    topbarSlot?: (props: TTopbarSlotProps) => any
    topbarInnerSlot?: (props: TTopbarSlotProps) => any

    topbarBorderBottom?: boolean
    topbarAbsolute?: boolean
    topbarAbsoluteRight?: boolean
    topbarSide?: any

    headerStyle?: ViewStyle
    headerSlot?: any
    headerInnerSlot?: any

    bodySlot?: any
    bodyScrollable?: boolean

    footerSlot?: any
    footerInnerSlot?: any
    footerPrependSlot?: any
    footerAppendSlot?: any
    footerActions?: UiBtnProps[]
    footerActionProps?: UiBtnProps,
    footerActionsContainerStyle?: ViewStyle
    footerActionsPrependSlot?: any
    footerIsFixed?: boolean
    footerPaddingDef?: boolean
    footerDynamic?: boolean

    closeAction?: boolean | string

    snapPoints?: any
    enablePanDownToClose?: boolean
    enableDismissOnClose?: boolean

    snapIndex?: number
    hide?: boolean
    loading?: boolean
    loadingReplace?: boolean

    onCloseManual?: () => void
    onClose?: TBottomSheetOnClose
    onBeforeClose?: TBottomSheetOnBeforeClose
    onSnapIndexChange?: any
    onSizeChange?: (rect: LayoutRectangle) => void
    onShow?: any
    onBodyHeightChange?: (height: number) => void

    preset?: keyof typeof presets
    targetModifiers?: PartialRecord<TBottomSheetTarget, string[]>
    targetStyles?: PartialRecord<TBottomSheetTarget, ViewStyle & TextStyle>

    detached?: boolean

    scrollToInput?: boolean | number
    keyboardFooterBehavior?: 'hidden' | 'visible'
    keyboardExtraSpace?: boolean | number

    backstageSlot?: any
    enableFooterMarginAdjustment?: boolean

    noScrollView?: boolean
}

export type UiBottomSheetMethods = BottomSheetModalMethods & {
    closeModal: () => void,
    scrollTo: (y: number, animated?: boolean) => void
    scrollToView: (view: any, process?: boolean) => void
}

export const UiBottomSheetComponent: React.FC<UiBottomSheetProps> = (
    {
        animateOnMount = true,
        useAnomalyInsets = false,
        closeOnRouterBack = true,
        scrollProps,
        inspector,

        id = '',
        hide,
        backgroundColor = '#FFFFFF',
        containerOverflowVisible = false,

        enableFooterMarginAdjustment = undefined,
        maxDynamicContentSize,
        autoHeight = true,
        backstageSlot,
        backdrop = true,
        shadow = true,
        isVisible,
        android_keyboardInputMode = KEYBOARD_INPUT_MODE.adjustResize,
        enablePanDownToClose = true,
        enableDismissOnClose = true,
        enableContentPanningGesture,
        enableHandlePanningGesture,

        closeAction,
        title,
        titleHide,

        topbarDeps,
        topbarHide = false,
        topbarSlot,
        topbarInnerSlot,

        topbarBorderBottom = true,
        topbarAbsolute = false,

        closer = true,

        headerSlot,
        headerInnerSlot,

        bodySlot,
        bodyScrollable = true,

        footerSlot,
        footerInnerSlot,
        footerPrependSlot,
        footerAppendSlot,
        footerIsFixed = true,
        footerActions,
        footerActionProps,
        footerActionsContainerStyle = {gap: 14},
        footerActionsPrependSlot,
        footerDynamic = false,

        onShow,
        onScroll,
        onClose,
        onCloseManual,
        onBeforeClose,
        onBodyHeightChange,

        snapPoints = [],
        snapIndex = 0,
        onSnapIndexChange,
        stackBehavior,
        loading,
        loadingReplace = true,
        children,
        onSizeChange,
        keyboardBehavior = 'interactive',
        keyboardFooterBehavior = 'visible',
        preset,
        targetModifiers,
        targetStyles = {},
        detached,
        topInset = true,
        topInsetAdd = 0,
        bottomInset = true,
        scrollToInput = true,
        keyboardExtraSpace = false,
        closerPosition = 'topbar',
        overDragResistanceFactor,
        fullscreen,
        noScrollView = false
    },
    ref
) => {

    const _scrollProps = {
        ...(scrollProps || {})
    }

    const {insets, anomalyBottomInset} = useScreenSize({outOfPage: true, useAnomalyInsets})

    const keyboard = useKeyboard()

    const {bus} = useServices()

    const [_snapIndex, setSnapIndex] = useState(snapIndex)

    const scrollPos = useRef<number>(0)

    const _footerIsFixed = footerIsFixed //&& !keyboardWillOpened

    let _topInsetAdd = topInsetAdd ? (typeof topInsetAdd === 'number' ? topInsetAdd : 12) : 0
    let _topInset = topInset ? (typeof topInset === 'number' ? topInset : insets.top + _topInsetAdd) : 0

    let _containerOverflowVisible = containerOverflowVisible
    let _enableFooterMarginAdjustment = typeof enableFooterMarginAdjustment === "undefined" ? _footerIsFixed : enableFooterMarginAdjustment

    if (closerPosition === 'outsideLeft' || closerPosition === 'outsideRight') {
        _containerOverflowVisible = true
        _topInset = _topInset + 35
    }

    const _bottomInset = bottomInset ? (typeof bottomInset === 'number' ? bottomInset : insets.bottom) : 0


    let _targetModifiers = {}

    if (preset) {
        if (presets[preset]) {
            if (presets[preset].targets) {
                _targetModifiers = {
                    ...presets[preset].targets
                }
            }
        }
    }

    _targetModifiers = {
        ..._targetModifiers,
        ...targetModifiers
    }

    const target = useTargetProps<TBottomSheetTarget>(targetKeys, _targetModifiers, targetStyles, {
        layoutInspector: false
    })

    const scrollTo = (y: number = 0, animated: boolean = true) => {
        refs.bodyScroll.current?.scrollTo({y, animated})
    }

    const scrollToView = (viewRef: NativeView, process = false) => {

        if (viewRef && viewRef.measureInWindow && refs.bodyScroll.current?.measure) {

            // @ts-ignore
            refs.bodyScroll.current?.measure((x, y, width, height, pageX, pageY) => {

                viewRef.measureInWindow((x, y, width, height) => {

                    const top = scrollPos.current + y - pageY

                    if (process)
                        setScrollToProcess(true)

                    requestAnimationFrame(() => {

                        refs.bodyScroll.current?.scrollTo({
                            y: top
                        })

                        if (process) {
                            setTimeout(() => {
                                refs.bodyScroll.current?.scrollTo({
                                    y: top
                                })
                            }, 300)
                        }

                    })
                })
            })
        }
    }

    useImperativeHandle<any, any>(ref, () => ({
        ...refs.modal.current,
        closeModal: () => {
            _onClose()
        },
        scrollTo,
        scrollToView,
    }))

    const refs = {
        modal: React.useRef<VendorBottomSheetModal>(null as any),
        modalView: React.useRef<Reanimated.View>(),
        bodyScroll: React.useRef<ScrollView & NativeView>(),
        holder: React.useRef<NativeView>(null as any),
        footer: React.useRef<NativeView>(null as any),
    }

    const footerLayout = useLayout(refs.footer, {testId: 'modal.footer'})
    const modalViewLayout = useLayout(refs.modalView, {testId: 'modal.view'})

    const onInputFocus = ({viewRef}: {
        viewRef: RefObject<NativeView>
    }) => {


        return;

        /*
        if (scrollToInput && viewRef.current && refs.bodyScroll.current) {


            if (typeof scrollToInput === 'number') {
                setTimeout(() => {
                    refs.bodyScroll.current?.scrollTo({
                        y: scrollToInput
                    })
                }, 500)
            } else if (Platform.OS === 'ios') {
                setTimeout(() => {
                    viewRef.current && scrollToView(viewRef.current)
                }, 500)
            }
        }

         */
    }

    useEffect(() => {
        bus.emitter.on('input:focus', onInputFocus)

        return () => {
            bus.emitter.off('input:focus', onInputFocus)
        }
    }, [])

    /*
    useEffect(() => {

        if (!keyboardWillOpened) {
            requestAnimationFrame(() => {
                setTimeout(() => {
                    setSnapIndex(snapIndexBeforeKeyboardOpened)
                }, 20)
            })
        } else {
            //  refs.modal.current.snapToPosition(700)
            setsSnapIndexBeforeKeyboardOpened(_snapIndex)
        }

    }, [keyboardWillOpened])
    */


    useEffect(() => {
        onSizeChange && onSizeChange(modalViewLayout.rect)
    }, [modalViewLayout.rect])

    useEffect(() => {
        setSnapIndex(snapIndex)
    }, [snapIndex])

    useEffect(() => {
        if (isVisible) {
            onShow && onShow()
            visibleSheetRef.current = refs.modal.current
            refs.modal.current?.present()
        } else {
            refs.modal.current?.dismiss()
        }
    }, [isVisible])


    const _onClose = (fromDismiss = false, fromAction = false) => {

        const beforeCloseResult = onBeforeClose ? onBeforeClose(fromDismiss, fromAction) : null
        if (!fromDismiss) {
            if (beforeCloseResult === false)
                return false
            onCloseManual && onCloseManual()
        }
        onClose && onClose(fromDismiss, fromAction)
    }

    const onSnapIndexChangeInternal = (index: number) => {
        if (index > -1) {
            setSnapIndex(index)
            onSnapIndexChange && onSnapIndexChange(index)
        } else {
            if (isVisible)
                onCloseManual && onCloseManual()
        }
    }

    const _footerActions = useMemo<UiBtnProps[]>(() => {
        const res: UiBtnProps[] = footerActions && footerActions.length ? [...footerActions] : []
        if (closeAction) {
            res.push({
                label: typeof closeAction === 'string' ? closeAction : 'Закрыть',
                onPress: () => {
                    _onClose && _onClose(false, true)
                }
            })
        }
        return res
        //return res.filter(item => !item.hideOnKeyboard || !keyboardWillOpened)
    }, [footerActions])


    /*
    useEffect(() => {
        if (_footerIsFixed) {
            setFooterHeight(footerLayout.measure.height)
        } else {
            setFooterHeight(0)
        }
    }, [_footerIsFixed, footerLayout.measure.height])

     */

    const closerRender = useCallback(((p: any = {}) => CLOSER_BACK({
        color: '#000000',
        size: 32,
        style: [
            p.style,
            styles[('closer_' + closerPosition) as keyof typeof styles],
        ],
        onPress: () => _onClose()
    })), [_onClose])

    const closerSlot: TCloserSlot | null = closer ? closerRender : null

    const topbar = useMemo(() => {

        if (topbarHide)
            return <>
                {closerSlot && closerSlot({style: {marginLeft: 'auto'}})}
            </>

        const titleSlot = title && <Text
            {...target.topbarTitle.props}
            style={[styles.title, target.topbarTitle.style as any]}
        >{title}</Text>

        let inner

        if (topbarSlot) {
            return render(topbarSlot, {titleSlot, closerSlot})
        } else if (topbarInnerSlot) {
            inner = render(topbarInnerSlot, {titleSlot, closerSlot})
        } else {
            inner = <>
                {!titleHide && titleSlot}
                {closerSlot && closerSlot({style: {marginLeft: 'auto'}})}
            </>
        }

        return inner && <View {...target.topbar.props} style={[
            styles.topbar,
            topbarAbsolute && styles.topbarAbsolute,
            target.topbar.style,
            topbarBorderBottom && styles.topbarBorderBottom
        ]}>
            {inner}
        </View>

    }, [
        topbarSlot,
        topbarInnerSlot,
        topbarDeps,
        title,
        onClose
    ])

    const keyboardAnimatedShow = useKeyboardAnimatedShow(90)

    const footerInnerAnimatedStyle = useAnimatedStyle(() => {
        return {
            paddingBottom: anomalyBottomInset + interpolate(keyboardAnimatedShow.value, [0, 1], [_bottomInset, 0])
        }
    }, [anomalyBottomInset, _bottomInset])

    const footer = useMemo(() => {

        let inner

        const innerStyle: ViewStyle = {}

        /*
        if (keyboardFooterBehavior === 'hidden' && keyboardWillOpened) {
            style.height = 0
            style.overflow = 'hidden'
        }
         */

        if (footerSlot) {
            return render(footerSlot)
        } else if (footerInnerSlot) {
            inner = <View reanimated style={[innerStyle, footerInnerAnimatedStyle]}>{render(footerInnerSlot)}</View>
        } else if (footerPrependSlot || footerAppendSlot || _footerActions.length) {
            inner = <View reanimated style={[innerStyle, footerInnerAnimatedStyle]}>
                {render(footerPrependSlot)}
                {!!_footerActions.length &&
                    <View
                        {...target.footerActions.props}
                        style={[target.footerActions.style]}
                    >
                        <UiActions
                            items={_footerActions}
                            containerStyle={footerActionsContainerStyle}
                            itemProps={footerActionProps}
                            prependSlot={footerActionsPrependSlot}
                        />
                    </View>
                }
                {render(footerAppendSlot)}
            </View>
        }

        return inner && <View
            style={[
                styles.footer,
                _enableFooterMarginAdjustment ? styles.footerFixed : null,
                _footerIsFixed ? target.footer.style : target.footerStatic.style,
            ]}
            {...(_footerIsFixed ? target.footer.props : target.footerStatic.props)}
        >
            {inner}
        </View>

    }, [
        footerSlot,
        footerInnerSlot,
        footerPrependSlot,
        footerAppendSlot,
        _footerActions,
        _footerIsFixed,
        _enableFooterMarginAdjustment,
        anomalyBottomInset,
        _bottomInset
    ])

    if (footerDynamic) {
        useWatch(() => {
            // @ts-ignore
            refs.bodyScroll.current?.recalc()
        }, [footer])
    }

    const backdropRender = (props: BottomSheetBackdropProps) => <TouchableWithoutFeedback
        onPress={() => {
            refs.modal.current?.dismiss()
        }}
    >
        <View style={[styles.backdrop, props.style, target.backdrop.style]}>

        </View>
    </TouchableWithoutFeedback>

    let backgroundStyle = useMemo<ViewStyle>(() => {
        let res: ViewStyle = {}
        if (shadow) {
            res = {
                ...res,
                ...styles.backgroundShadow,
            }
            if (backgroundColor) {
                res.backgroundColor = backgroundColor
            }
        }
        return res
    }, [shadow, backgroundColor])

    const FixedFooterWrapper = useCallback((props: BottomSheetDefaultFooterProps) => {
        // @ts-ignore
        return <BottomSheetFooter {...props}>
            <View
                ref={refs.footer}
                //onLayout={footerLayout.onLayout}
                style={{
                    // paddingBottom: !keyboardWillOpened ? offsetBottom : 0,
                    backgroundColor: '#FFFFFF'
                }}
            >
                {footer}
            </View>
        </BottomSheetFooter>
    }, [footer])


    let overrideProps: Partial<BottomSheetProps> = {}

    overrideProps.handleComponent = useCallback(() => {

        let header

        if (headerSlot)
            header = render(headerSlot)
        else if (headerInnerSlot)
            header = <View {...target.header.props} style={[styles.header, target.header.style]}>
                {render(headerInnerSlot)}
            </View>

        return topbar || header ? <View>
            {topbar}
            {header}
        </View> : <></>

    }, [headerInnerSlot, topbar, topbarDeps])

    if (backdrop)
        overrideProps.backdropComponent = backdropRender

    if (_footerIsFixed) {
        overrideProps.footerComponent = FixedFooterWrapper
    }

    if (autoHeight) {
        overrideProps.enableDynamicSizing = true
    } else {
        overrideProps.enableDynamicSizing = false
        overrideProps.snapPoints = snapPoints
        overrideProps.index = _snapIndex
        overrideProps.onChange = onSnapIndexChangeInternal
    }

    if (hide) {
        return <></>
    }

    const SheetScroll = BottomSheetScrollView
    const Sheet = VendorBottomSheetModal
    const SheetView = BottomSheetView

    const contentContainerStyle = useMemo(() => {
        return [
            uiLibGenerateModifiersStyle(target.scrollContent.props),
            {
                // paddingBottom: keyboardWillOpened ? keyboardHeight : 0
            }
        ]
    }, [])


    useWatch(() => {
        if (!bodyScrollable) {
            refs.bodyScroll.current?.scrollTo({y: 0, animated: false})
        }
    }, [bodyScrollable])

    const [scrollToProcess, setScrollToProcess] = useState(false)

    /*
    const keyboardExtraSpaceRendered = !!keyboardExtraSpace && keyboardWillOpened && <View style={{
        height: typeof keyboardExtraSpace === 'number' ? keyboardExtraSpace : keyboardHeight,
    }}></View>

     */
    const keyboardExtraSpaceRendered = <></>

    const updateBodyHeight = useDebounceCallback((height: number) => {
        onBodyHeightChange && onBodyHeightChange(height)
    }, 500)

    const _onBodyLayout = (event: LayoutChangeEvent) => {
        updateBodyHeight(event.nativeEvent.layout.height)
    }

    return (

        <Sheet
            animateOnMount={animateOnMount}
            topInset={_topInset}
            ref={refs.modal}
            stackBehavior={stackBehavior}
            detached={detached}
            onDismiss={() => _onClose(true)}
            enablePanDownToClose={enablePanDownToClose}
            enableDismissOnClose={enableDismissOnClose}
            enableOverDrag={false}
            overDragResistanceFactor={overDragResistanceFactor}
            style={[styles.modal, target.modal.style]}
            keyboardBehavior={keyboardBehavior as any}
            android_keyboardInputMode={android_keyboardInputMode}
            keyboardBlurBehavior={'restore'}
            backgroundStyle={backgroundStyle}
            enableContentPanningGesture={enableContentPanningGesture}
            enableHandlePanningGesture={enableHandlePanningGesture}
            maxDynamicContentSize={maxDynamicContentSize}
            //backstage={backstageSlot}
            //containerOverflowVisible={_containerOverflowVisible}
            //contentRounded={topbarHide}
            //closeOnRouterBack={closeOnRouterBack}
            //fullscreen={fullscreen}
            {...overrideProps}
        >

            {loading && <LoaderScreen
                overlay={true}
                color={COLORS.grey20}
                containerStyle={{backgroundColor: 'rgba(255, 255, 255, 0.7)'}}
            />}

            {
                noScrollView ?
                    <SheetView
                        enableFooterMarginAdjustment={_enableFooterMarginAdjustment}
                        style={[
                            contentContainerStyle,
                            !bodyScrollable && {
                                flex: 1
                            }
                        ]}
                        onLayout={_onBodyLayout}
                    >
                        {flattenChildren(render(bodySlot || children)).map(item => item)}
                        {!_footerIsFixed && footer}
                        {keyboardExtraSpaceRendered}
                    </SheetView>
                    :
                    (autoHeight ?
                            <SheetScroll
                                enableFooterMarginAdjustment={_enableFooterMarginAdjustment}
                                //nestedScrollEnabled={true}
                                scrollEnabled={bodyScrollable}
                                style={[
                                    styles.scroll,
                                    target.scroll.style,
                                    uiLibGenerateModifiersStyle(target.scroll.props)
                                ]}
                                ref={(t) => {
                                    // @ts-ignore
                                    refs.bodyScroll.current = t
                                }}
                                //scrollEventsHandlersHook={useDefaultHook}
                                onScroll={(e) => {
                                    onScroll && onScroll(e.nativeEvent.contentOffset.y)
                                    scrollPos.current = e.nativeEvent.contentOffset.y

                                    //onScrollDebounced(e)
                                    //setScrollY(e.nativeEvent.contentOffset.y)
                                    //animScrollY.value = withSpring(e.nativeEvent.contentOffset.y, {})
                                }}
                                bounces={false}
                                contentContainerStyle={contentContainerStyle}
                                {..._scrollProps}
                            >
                                {flattenChildren(render(bodySlot || children)).map(item => item)}
                                {!_footerIsFixed && footer}
                                {keyboardExtraSpaceRendered}
                            </SheetScroll>
                            :
                            <SheetScroll
                                enableFooterMarginAdjustment={_enableFooterMarginAdjustment}
                                style={[
                                    styles.scroll,
                                    target.scroll.style,
                                    uiLibGenerateModifiersStyle(target.scroll.props),
                                    !bodyScrollable && {
                                        flex: 1
                                    },
                                    {
                                        // marginTop: -keyboardHeightAnimated
                                    },
                                    //animatedStyles
                                ]}
                                ref={(t) => {
                                    // @ts-ignore
                                    refs.bodyScroll.current = t
                                }}
                                onScroll={(e: any) => {
                                    onScroll && onScroll(e.nativeEvent.contentOffset.y)
                                    scrollPos.current = e.nativeEvent.contentOffset.y

                                    //onScroll && onScroll(e.nativeEvent.contentOffset.y, e.nativeEvent.contentOffset.x)
                                    //setScrollY(e.nativeEvent.contentOffset.y)
                                    //animScrollY.value = withSpring(e.nativeEvent.contentOffset.y, {})
                                }}
                                //scrollEnabled={keyboardWillOpened ? true : bodyScrollable}
                                bounces={false}
                                contentContainerStyle={[
                                    contentContainerStyle,
                                    !bodyScrollable && {
                                        flex: 1
                                    }
                                ]}
                                onLayout={_onBodyLayout}
                            >
                                {flattenChildren(render(bodySlot || children)).map(item => item)}
                                {!_footerIsFixed && footer}
                                {keyboardExtraSpaceRendered}
                            </SheetScroll>
                    )
            }

        </Sheet>
    )
}

// @ts-ignore
export const UiBottomSheet = React.forwardRef<UiBottomSheetMethods, UiBottomSheetProps>(UiBottomSheetComponent)

const visibleSheetRef: any = {current: null}


export function useBottomSheetScope(
    props: TBottomSheetScopeProps
): TBottomSheetScope {

    const {
        onClose,
        snapPoints = [],
        initialSnapIndex = 0,
        initialLoading = false,
        layout,
        toggleOnFocusEffect = false,
        backstageHeightType = 'auto',
        backstageHeightSnapIndex,
        initialVisible = false,
        visibleState,
        autoHeight = false,
        apiRef
    } = props

    const externalVisibleState = (typeof visibleState !== 'undefined')

    const _toggleOnFocusEffect = !externalVisibleState && toggleOnFocusEffect

    if (_toggleOnFocusEffect) {
        useFocusEffect(
            useCallback(() => {
                if (_toggleOnFocusEffect)
                    setVisible(true)
                return () => {
                    if (_toggleOnFocusEffect)
                        setVisible(false)
                }
            }, [])
        )
    }

    const [loading, setLoading] = useState(initialLoading)
    const [visible, setVisible] = useState(initialVisible)
    const [snapIndex, setSnapIndex] = useState<number>(initialSnapIndex)
    const [measure, setMeasure] = useState<{
        height: number
    }>({
        height: 0
    })

    const snapPoint = snapPoints[snapIndex]

    const visibleComputed = externalVisibleState ? visibleState : visible

    const snapSizeToHeight = (size: any) => {
        return size.toString().match('%') ?
            Math.round((wHeight / 100) * parseInt(size.toString().replace('%', '')))
            :
            Math.round(parseInt(snapPoint.toString()))
    }

    const snapSize = snapPoint ? snapSizeToHeight(snapPoint) : null

    const backstageHeight = useMemo(() => {

        if (autoHeight) {
            return measure.height ? wHeight - measure.height : wHeight
        }

        let res = wHeight

        switch (backstageHeightType) {
            case 'snapIndex':
                if (typeof backstageHeightSnapIndex !== 'undefined') {
                    const backstageSnapPoint = snapPoints[backstageHeightSnapIndex]
                    if (backstageSnapPoint)
                        res = wHeight - snapSizeToHeight(snapPoints[backstageHeightSnapIndex])
                }
                break;
            case 'auto':
                if (snapIndex >= 0 && snapPoint) {
                    res = wHeight - snapSizeToHeight(snapPoint)
                }
                break;
        }

        if (layout && layout.measure?.pageY) {
            res -= layout.measure.pageY
        }

        return res

    }, [snapIndex, layout?.measure?.pageY, measure.height])

    const onSizeChange = (v: any) => {
        setMeasure(v)
    }

    const show = (snapIndex?: number) => {
        if (typeof snapIndex === "number")
            setSnapIndex(snapIndex)
        setVisible(true)
    }

    const hide = useCallback(() => {
        setVisible(false)
    }, [])

    const _onClose = () => {

        if (onClose) {
            onClose()
        } else {
            hide()
        }
    }

    const render = (children: any) => <UiBottomSheet
        {...props}
        onClose={_onClose}
        isVisible={visible}
        children={children}
    />

    const methods = {
        setVisible,
        show,
        hide,
        close: hide,
        setSnapIndex,
        setLoading,
        onSizeChange,
        render
    }

    if (apiRef)
        apiRef.current = methods

    return {
        measure,
        autoHeight,
        visible: visibleComputed,
        snapPoints,
        snapPoint,
        snapIndex,
        backstageHeight,
        loading,
        snapSize,
        props,
        ...methods
    } as TBottomSheetScope
}

export type TBottomSheetScopeProps = Omit<Partial<UiBottomSheetProps>, 'footerActions'> & {
    initialSnapIndex?: number,
    initialLoading?: boolean,
    layout?: TLayoutScope,
    toggleOnFocusEffect?: boolean,
    backstageHeightType?: 'auto' | 'snapIndex',
    backstageHeightSnapIndex?: number,
    initialVisible?: boolean,
    visibleState?: boolean,
    prerender?: boolean,
    footerActions?: UiBtnProps[]
    apiRef?: MutableRefObject<TBottomSheetApi | undefined>
}

export type TBottomSheetScope = {
    measure: any
    autoHeight: boolean
    visible: boolean
    hide: () => void
    show: (snapIndex?: number) => void
    close: () => void
    setVisible: (val: boolean) => void
    snapPoints: (number | string)[]
    snapPoint: number | string
    snapIndex: number
    snapSize: number | null
    setSnapIndex: (index: number) => void
    backstageHeight: number
    loading: boolean
    setLoading: (v: boolean) => void
    onSizeChange: (size: any) => void
    props: UiBottomSheetProps
    render: (children: any) => any
}

export type TBottomSheetApi = {
    hide: () => void
    show: (snapIndex?: number) => void
}

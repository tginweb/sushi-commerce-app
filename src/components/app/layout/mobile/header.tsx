import {ParamListBase} from "@react-navigation/native"
import {NativeStackNavigationOptions, NativeStackNavigationProp} from "@react-navigation/native-stack"
import React, {useCallback, useEffect, useMemo, useRef} from "react"
import {StyleSheet, View as NativeView} from "react-native"
import {Text, TouchableOpacity, View} from "react-native-ui-lib"
import {useSafeAreaInsets} from "react-native-safe-area-context"
import {useLocalSearchParams} from "expo-router"
import {UiActions} from "~ui/actions"
import {UiBtnProps} from "~ui/btn"
import {Href, TPresetName} from "@core/main/types"
import {COLORS, TYPOGRAPHY} from "~assets/design"
import {IconBackRender, icons} from "~assets/icons-map"
import {useStores} from "~stores"
import {useServices} from "~services";
import {UiStatusBar} from "~ui/status-bar";
import {useDebounceCallback} from "@core/main/lib/hooks/useDebounceCallback";
import {usePresets} from "@core/main/lib/hooks/usePresets";
import {TouchableWithoutFeedback} from "react-native-gesture-handler";

export type NavHeaderOptions = NativeStackNavigationOptions & {

    headerLeftStyle: object
    headerIsModal?: boolean

    headerBackEnable?: boolean
    headerBackLabel?: string
    headerBackRoute?: Href
    headerBackHandle?: () => void

    headerMenuEnable?: boolean
    headerMenuPress?: () => void

    headerRightActions?: UiBtnProps[],

    headerPreset?: TPresetName
}

interface TProps extends NativeStackNavigationOptions {
    options: NavHeaderOptions
    navigation: NativeStackNavigationProp<ParamListBase>
}

export const AppNavHeader: React.FC<TProps> = (
    {
        navigation,
        options
    }
) => {

    const {debug, main, ui, router} = useStores()
    const {bus} = useServices()

    const routeParams = useLocalSearchParams()

    const insets = useSafeAreaInsets()

    let {
        headerBackEnable = true,
        headerBackLabel = '',
        headerBackRoute,
        headerBackHandle,
        headerRightActions,
        headerRight,
        headerPreset = 'titleCenter'
    } = options

    const updateHeight = useDebounceCallback((height: number) => {
        ui.appLayoutHeaderHeightSet(height)
    }, 100)

    useEffect(useCallback(() => {

        return () => {
            updateHeight(0)
        }
    }, []), [])


    const _canGoBack = headerBackEnable && !routeParams.backdisable && (
        router.currentRoute.canGoBack
        || !!headerBackRoute
        || !!headerBackHandle
    )

    const onBack = useCallback(() => {

        router.onGoBackBefore()

        let cb: any

        if (headerBackHandle) {
            cb = headerBackHandle
        } else if (headerBackRoute) {
            cb = () => headerBackRoute && router.replace(headerBackRoute)
        }

        bus.emitter.emit('bus:router.back', cb)

    }, [headerBackHandle, headerBackRoute])

    const rightActions = useMemo(() => {
        const res: UiBtnProps[] = headerRightActions || []
        if (routeParams.skiplink) {
            res.push({
                label: 'Пропустить',
                onPress: () => router.push(routeParams.skiplink as string)
            })
        }
        return res
    }, [headerRightActions])

    const rightRendered = useMemo(() => {
        if (headerRight) {
            return headerRight({
                tintColor: COLORS.primary,
                canGoBack: _canGoBack
            })
        } else if (rightActions.length) {
            return <UiActions
                items={rightActions}
                itemProps={{
                    outline: true,
                    avoidMinWidth: true,
                    color: COLORS.primary,
                    size: 'xSmall'
                }}
                containerStyle={{
                    flexDirection: 'row',
                    gap: 5,
                    flexWrap: 'wrap',
                    justifyContent: 'flex-end',
                }}
            />
        }
    }, [headerRight, rightActions, _canGoBack])

    const presetResult = usePresets(options, headerPreset, presets, [])

    const onTitleLongPress = useCallback(() => {
        if (debug.devMode)
            debug.showBubbleToggle()
    }, [debug.showBubble])

    let top = 6

    top += insets.top

    const refs = {
        layout: useRef<NativeView>(null as any)
    }

    const onLayout = useCallback(() => {
        refs.layout.current?.measure((x, y, width, height, pageX, pageY) => {
            updateHeight(height)
        })
    }, [])

    return <View
        onLayout={onLayout}
        ref={refs.layout}
        style={[
            styles.container,
            {paddingTop: top}
        ]}
    >
        <View>
            <View
                style={[
                    styles.header,
                    options.headerStyle,
                ]}
            >
                <View style={[styles.headerLeft, options.headerLeftStyle, presetResult.styles.left]}>
                    {_canGoBack && (
                        <TouchableOpacity
                            onPress={onBack}
                            style={styles.headerBack}
                            row
                            centerV
                            gap-5
                        >
                            {IconBackRender(COLORS.grey20, 22)}
                            {headerBackLabel && <Text>{headerBackLabel}</Text>}
                        </TouchableOpacity>
                    )}
                </View>
                <TouchableWithoutFeedback
                    delayLongPress={2000}
                    onLongPress={onTitleLongPress}
                >
                    <View
                        style={[styles.headerCenter, presetResult.styles.center]}
                        row
                        centerV
                    >
                        <icons.logoMini
                            color={COLORS.grey30}
                            size={20}
                        />
                        <Text
                            style={[
                                styles.headerTitle,
                                options.headerTitleStyle,
                            ]}
                        >
                            {options.title}
                        </Text>
                    </View>
                </TouchableWithoutFeedback>
                <View style={[styles.headerRight, presetResult.styles.right]}>
                    {rightRendered}
                </View>
            </View>
            <UiStatusBar containerStyle={styles.statusBar}/>
        </View>
    </View>
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 15,
        paddingRight: 15,
        paddingBottom: 5,
        gap: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eeeeee'
    },
    headerBack: {
        paddingHorizontal: 10
    },
    headerLeft: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexDirection: 'row',
    },
    headerCenter: {
        alignSelf: 'center',
        alignItems: 'center',
        textAlign: 'center',
        paddingVertical: 5,
        gap: 6,
        //borderWidth: 1
    },
    headerRight: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        flexWrap: 'wrap',
        //borderWidth: 1
    },
    headerTitle: {
        ...TYPOGRAPHY['text-md-lh0'],
        marginTop: 2
    },
    statusBar: {
        position: 'absolute',
        width: '100%',
        top: '100%',
        left: 0
    },
})

const presets = {
    titleLeft: () => ({
        styles: StyleSheet.create({
            header: {},
            left: {},
            center: {},
            right: {
                flex: 1
            },
        }),
    }),
    titleCenter: () => ({
        styles: StyleSheet.create({
            header: {
                justifyContent: 'space-between',
            },
            left: {
                flex: 1
            },
            center: {},
            right: {
                flex: 1
            },
        }),
    }),
}

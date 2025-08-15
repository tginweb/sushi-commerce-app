import React, {useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState} from "react"
import {useStores} from "~stores"
import {LayoutChangeEvent, StyleSheet, ViewStyle} from "react-native"
import {TGeoCoords, TGeoCoordsArray, TGeoCoordsData, TMapMarkerYandexData} from "@core/geo/types"
import {TouchableOpacity, View} from "react-native-ui-lib"
import {UiBtn, UiBtnProps} from "~ui/btn"
import {icons} from "~assets/icons-map"
import {GeoMarker} from "@core/geo/class/GeoMarker";
import {useWatch} from "@core/main/lib/hooks/useWatch";
import {COLORS, THEME_STYLE} from "~assets/design";
import {compareCoords} from "@core/geo/util/compareCoords";
import useKeyboard from "@core/main/lib/hooks/useKeyboard";
import Reanimated, {
    SharedValue,
    useAnimatedKeyboard,
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from "react-native-reanimated";
import {UiActions, UiActionsProps} from "~ui/actions";
import {useStateRef} from "@core/main/lib/hooks/useStateRef";
import {observer} from "mobx-react";
import {UiWebView, UiWebViewApi} from "~ui/webview";
import {coordsGetArray} from "@core/geo/util/coordsGetArray";

const defaultMapButtonProps: UiBtnProps = {
    iconSize: 20,
    diameter: 34,
    size: 'large',
    round: true,
    color: '#666666',
    backgroundColor: '#FFFFFF',
    enableShadow: true,
    outlineColor: COLORS.grey50,
    rounded: true,
    loadingHideLabel: true,
    buttonStyle: {
        ...THEME_STYLE.shadow1,
    }
}

export type MapYandexCenterComponent = (props: { loading?: boolean, dragging?: boolean }) => React.ReactNode

export type MapYandexProps = {
    debug?: boolean
    controlsOffsetTop?: number
    controlsOffsetBottom?: number
    width?: number
    height?: number
    heightSubtract?: ('inset.top' | 'inset.bottom' | 'header')[]
    offsetX?: number
    offsetY?: number
    coords: TGeoCoordsData
    zoom?: number
    onMarkerClick?: (markerId: string) => void
    onPositionChange?: (coords: TGeoCoords) => void
    onPositionChangeEnd?: (coords: TGeoCoords) => void
    centerComponent?: MapYandexCenterComponent
    centerComponentHeight?: number
    centerComponentWidth?: number
    positionLoading?: boolean
    markers?: GeoMarker[]
    selectedMarkerId?: string
    markersSelectable?: boolean
    driver?: GeoMarker | null
    onClose?: () => void
    onPress?: () => void
    onPressIn?: () => void
    onPressOut?: (afterDrag: boolean) => void
    onDrag?: () => void
    onLockedPress?: () => void
    locked?: boolean
    containerStyle?: ViewStyle
    zoomControl?: TMapZoomControl
    marginTop?: number
    offsetTopAnimated?: SharedValue<number>
    footerActions?: UiActionsProps
    actionNavigatorEnable?: boolean
}


type TMapZoomControl = {
    size?: string,
    position?: {
        right?: number,
        top?: number,
    }
}


type TMapEventMapReady = {
    name: 'mapReady'
}

type TMapEventMapInitialized = {
    name: 'mapInitialized',
    center: TGeoCoordsArray
    zoom: number
}

type TMapEventBoundschange = {
    name: 'boundschange',
    center: TGeoCoordsArray
    zoom: number
}

type TMapEventDoublePress = {
    name: 'doublePress',
}

type TMapEventPress = {
    name: 'press',
}

type TMapEventDrag = {
    name: 'drag',
}

type TMapEventPressIn = {
    name: 'pressIn',
}

type TMapEventPressOut = {
    name: 'pressOut',
    center: TGeoCoordsArray
    zoom: number
}

type TMapEventMarkerClick = {
    name: 'markerClick',
    markerId: string
}

type TMapEvent = TMapEventMapReady |
    TMapEventMapInitialized |
    TMapEventBoundschange |
    TMapEventDoublePress |
    TMapEventPress |
    TMapEventDrag |
    TMapEventPressIn |
    TMapEventPressOut |
    TMapEventMarkerClick

type TMapCommandMapInit = {
    name: 'mapInit',
    coords: TGeoCoordsArray
    offsetX?: number
    offsetY?: number
    zoom?: number
    markers?: TMapMarkerYandexData[]
    selectedMarkerId?: string
    markersSelectable?: boolean
    driver?: TMapMarkerYandexData
    marginTop?: number
}

type TMapCommandSetMarginTop = {
    name: 'setMarginTop',
    marginTop: number
}

type TMapCommandControlsUpdate = {
    name: 'controlsUpdate',
}

type TMapCommandSetCenter = {
    name: 'setCenter',
    coords: TGeoCoordsArray
    zoom?: number
}

type TMapCommandSetZoom = {
    name: 'setZoom'
    zoom: number
}

type TMapCommandZoomInc = {
    name: 'zoomInc'
}

type TMapCommandZoomDec = {
    name: 'zoomDec'
}

type TMapCommandResize = {
    name: 'resize'
    width: number
    height: number
}

type TMapCommandMoveToMarker = {
    name: 'moveToMarker',
}

type TMapCommandMoveToDriver = {
    name: 'moveToDriver',
}

type TMapCommandMoveToId = {
    name: 'moveToMarkerId',
    id: string,
    select?: boolean
}

type TMapCommandSetOffset = {
    name: 'setOffset',
    x?: number
    y?: number
}

type TMapCommandShowAllMarkers = {
    name: 'showAllMarkers',
}

type TMapCommandUpdateMarkers = {
    name: 'updateMarkers',
    markers?: TMapMarkerYandexData[]
    markersObjects?: GeoMarker[]
}

type TMapCommandDriverChange = {
    name: 'driverChange',
    driver: TMapMarkerYandexData
}

export type TMapCommand =
    TMapCommandMapInit |
    TMapCommandSetMarginTop |
    TMapCommandControlsUpdate |
    TMapCommandSetCenter |
    TMapCommandSetZoom |
    TMapCommandZoomInc |
    TMapCommandZoomDec |
    TMapCommandResize |
    TMapCommandMoveToMarker |
    TMapCommandMoveToDriver |
    TMapCommandMoveToId |
    TMapCommandSetOffset |
    TMapCommandShowAllMarkers |
    TMapCommandUpdateMarkers |
    TMapCommandDriverChange

export type MapYandexApi = {
    command: (command: TMapCommand) => void
}

const MapYandexComponent: React.FC<MapYandexProps> = (
    {
        debug = false,
        containerStyle,
        controlsOffsetTop = 0,
        controlsOffsetBottom = 0,
        width,
        height,
        offsetX = 0,
        offsetY = 0,
        coords,
        zoom = 14,
        centerComponent,
        centerComponentHeight = 0,
        centerComponentWidth = 0,
        onMarkerClick,
        onPositionChange,
        onPositionChangeEnd,
        markers = [],
        selectedMarkerId,
        markersSelectable = false,
        driver,
        positionLoading,
        onClose,
        onPress,
        onPressIn,
        onPressOut,
        onDrag,
        onLockedPress,
        locked = false,
        zoomControl,
        marginTop = 0,
        offsetTopAnimated,
        heightSubtract,
        footerActions,
        actionNavigatorEnable = true
    },
    ref
) => {
    const {geo, ui} = useStores()

    const webref = useRef<UiWebViewApi>(null)

    const refs = {
        layout: React.useRef<any>(),
    }

    const keyboard = useKeyboard()
    const [mapInitialized, setMapInitialized] = useState(false)

    const [coordsState, setCoordsState] = useState<TGeoCoordsArray>(() => {
        const coordsArray = coordsGetArray(coords)
        return coordsArray || [52.273566, 104.311535] as any
    })

    const [mapDragging, , mapDraggingRef, updateMapDragging] = useStateRef<boolean>(false)

    const [zoomState, setZoomState] = useState<number>(zoom)

    const [sizeState, setSizeState] = useState<{
        width: number,
        height: number
    }>({
        width: 0,
        height: 0
    })

    useWatch(() => {
        const _sizeState = {...sizeState}
        if (width)
            _sizeState.width = width
        if (height)
            _sizeState.height = height
        setSizeState(_sizeState)
    }, [width, height])

    const {
        _sizeStyle,
        _marginTop,
        _controlsOffsetTop,
        _controlsOffsetBottom,
        _sizeCalculated
    } = useMemo(() => {

        let _marginTop = marginTop

        const _sizeCalculated = sizeState.width && sizeState.height

        const _sizeStyle: ViewStyle = {}

        if (_sizeCalculated) {
            if (sizeState.width)
                _sizeStyle.width = sizeState.width
            if (sizeState.height)
                _sizeStyle.height = sizeState.height
        }

        const _controlsOffsetTop = controlsOffsetTop - _marginTop
        const _controlsOffsetBottom = controlsOffsetBottom + _marginTop + keyboard.height

        return {
            _marginTop,
            _controlsOffsetTop,
            _controlsOffsetBottom,
            _sizeStyle,
            _sizeCalculated
        }
    }, [
        sizeState,
        marginTop,
        keyboard.height,
        controlsOffsetTop,
        controlsOffsetBottom
    ])


    const onEvent = (event: TMapEvent) => {

        switch (event.name) {
            case "mapReady":
                debug && console.log('ymapsReady', event)
                sendToWebView({
                    name: 'mapInit',
                    coords: coordsState,
                    offsetX: offsetX,
                    offsetY: offsetY,
                    zoom: zoomState,
                    markers: markers.map(marker => marker.getYandexData()),
                    selectedMarkerId,
                    markersSelectable,
                    driver: driver ? driver.getYandexData() : undefined,
                    marginTop: _marginTop
                })
                break
            case 'mapInitialized':
                setMapInitialized(true)
                break
            case "boundschange":
                setLocation(event.center, event.zoom, false)
                break
            case "doublePress":
                onPositionChangeEnd && onPositionChangeEnd(coordsState)
                break
            case "press":
                onPress && onPress()
                break
            case "drag":
                updateMapDragging(true)
                onDrag && onDrag()
                break
            case "pressIn":
                onPressIn && onPressIn()
                break
            case "pressOut":
                const coordsChanged = setLocation(event.center, event.zoom, false)
                onPressOut && onPressOut(mapDraggingRef.current)
                if (mapDraggingRef.current) {
                    onPositionChangeEnd && onPositionChangeEnd(coordsState)
                    setTimeout(() => {
                        updateMapDragging(false)
                    }, 70)
                }
                break
            case "markerClick":
                onMarkerClick && onMarkerClick(event.markerId)
                break
        }
    }

    const sendToWebView = (command: TMapCommand) => {
        webref.current?.command(command)
    }

    const command = (command: TMapCommand) => {
        switch (command.name) {
            case 'updateMarkers':
                const markersToUpdate = command.markersObjects || markers
                command.markers = markersToUpdate.map(marker => marker.getYandexData())
                break;
            default:
        }
        webref.current?.command(command)
    }

    useImperativeHandle<any, MapYandexApi>(ref, () => ({
        command
    }))

    useWatch(() => {
        command({
            name: 'setOffset',
            x: offsetX,
            y: offsetY
        })
    }, [offsetX, offsetY])

    useWatch(() => {
        command({
            name: 'setMarginTop',
            marginTop: _marginTop
        })
    }, [_marginTop])


    useEffect(() => {

        const coordsArray = coordsGetArray(coords)
        if (coordsArray) {
            command({
                name: 'setCenter',
                coords: coordsArray
            })
            setCoordsState(coordsArray)
        }
    }, [coords])

    useEffect(() => {

        if (driver)
            command({
                name: 'driverChange',
                driver: driver.getYandexData()
            })
    }, [driver])

    const _offsetTopAnimated = offsetTopAnimated || useSharedValue(0)

    useEffect(() => {

        _offsetTopAnimated.value = withTiming(_marginTop, {duration: 300})
    }, [_marginTop])

    // METHODS

    const setLocation = (
        coords: TGeoCoordsArray,
        zoom?: number,
        moveMap = false
    ) => {

        debug && console.log('setLocation', {
            coords,
            zoom,
            coordsState,
            zoomState
        })

        const coordsChanged = !compareCoords(coords, coordsState)

        if (coordsChanged) {
            setCoordsState(coords)
            onPositionChange && onPositionChange(coords)
        }
        if (zoom && (zoom !== zoomState)) {
            setZoomState(zoom)
        }

        moveMap && setTimeout(() => {
            command({
                name: 'setCenter',
                coords,
                zoom
            })
            onPositionChangeEnd && onPositionChangeEnd(coords)
        }, 100)

        return coordsChanged
    }

    const onGeoposition = async () => {
        const coords = await geo.getLocationCoords()
        if (coords) {
            const coordsData = coords.getArray()
            if (coordsData) {
                setLocation(coordsData, 18, true)
            }
        }
    }

    const onShowAllMarkers = async () => {
        command({
            name: 'showAllMarkers'
        })
    }

    const onZoomInc = useCallback(() => {
        command({name: 'zoomInc'})
    }, [])

    const onZoomDec = useCallback(() => {
        command({name: 'zoomDec'})
    }, [])


    const center = useMemo(() => {
        if (
            !centerComponent ||
            !_sizeCalculated ||
            !centerComponentWidth
        ) {
            return <></>
        }

        return <View
            style={[
                styles.btnCenter, {
                    left: (sizeState.width / 2) - (centerComponentWidth / 2),
                    bottom: (sizeState.height / 2) - offsetY
                }
            ]}
            pointerEvents={'none'}
        >
            {centerComponent({
                loading: positionLoading,
                dragging: mapDragging
            })}
        </View>
    }, [
        offsetY,
        sizeState,
        centerComponentWidth,
        centerComponent,
        positionLoading,
        mapDragging
    ])

    const keyboardAnimated = useAnimatedKeyboard();

    const actionsAnimatedStyle = useAnimatedStyle(() => {
        return {
            bottom: 0,
            transform: [{translateY: -keyboardAnimated.height.value}],
        } as any
    });

    const holderAnimatedStyle = useAnimatedStyle(() => {
        return sizeState.height ? {
            //marginTop: _offsetTopAnimated.value,
            //height: sizeState.height - _offsetTopAnimated.value
        } : {}
    }, [sizeState.height])

    const containerAnimatedStyle = useAnimatedStyle(() => {
        return (sizeState.height ? {
            //height: sizeState.height - _offsetTopAnimated.value
            transform: [{translateY: _offsetTopAnimated.value}]
        } : {}) as any
    }, [sizeState.height])

    const onLayout = useCallback((event: LayoutChangeEvent) => {
        if (!_sizeCalculated) {
            const eventLayout = event.nativeEvent.layout
            setSizeState({
                width: eventLayout.width,
                height: eventLayout.height,
            })
        }
    }, [_sizeCalculated])

    const renderInner = () => <>
        <UiWebView
            ref={webref}
            bounces={false}
            style={[styles.map]}
            onEvent={onEvent as any}
            url={'https://irkutsk.sushi-studio.ru/api-new/ymap.php'}
            cacheEnabled={true}
            cacheMode={'LOAD_CACHE_ELSE_NETWORK'}
        />

        {center}

        {locked && <TouchableOpacity
            style={styles.overlay}
            onPress={onLockedPress}
        />}

        <View style={[styles.actionsTopLeft, {top: _controlsOffsetTop + 20}]}>
            {onClose && <UiBtn
                icon={icons.cancel}
                {...defaultMapButtonProps}
                onPress={onClose}
            />}
        </View>

        <View
            style={[styles.actionsTopRight, {top: _controlsOffsetTop + 20}]}
            gap-10
        >
            <View gap-2>
                <UiBtn
                    icon={icons.plus}
                    {...defaultMapButtonProps}
                    onPress={onZoomInc}
                />
                <UiBtn
                    icon={icons.minus}
                    {...defaultMapButtonProps}
                    onPress={onZoomDec}
                />
            </View>
        </View>

        <View
            style={[styles.actionsBottomRight, {bottom: _controlsOffsetBottom + 20}]}
            gap-10
        >
            {actionNavigatorEnable && <UiBtn
                icon={icons.nav}
                {...defaultMapButtonProps}
                diameter={42}
                onPress={onGeoposition}
                loading={geo.getLocationCoords.pending}
            />}

            {markers.length > 1 && <UiBtn
                icon={icons.expand}
                {...defaultMapButtonProps}
                onPress={onShowAllMarkers}
            />}
        </View>

        {
            footerActions && footerActions.items &&
            <Reanimated.View
                style={[
                    {
                        position: 'absolute',
                        left: 0,
                        width: '100%',
                        zIndex: 10000,
                        paddingHorizontal: 11
                    },
                    actionsAnimatedStyle
                ]}
            >
                <UiActions {...footerActions}/>
            </Reanimated.View>
        }
    </>

    return <View reanimated flex style={[styles.holder, holderAnimatedStyle]}>
        <View reanimated flex ref={refs.layout}
              style={[styles.container, containerStyle, _sizeStyle, containerAnimatedStyle]} onLayout={onLayout}>
            {!!_sizeCalculated && renderInner()}
        </View>
    </View>
}

// @ts-ignore
export const MapYandex = observer(React.forwardRef(MapYandexComponent))


const styles = StyleSheet.create({
    holder: {},
    container: {
        position: "relative",
        //backgroundColor: '#FF0000'
    },
    map: {
        flex: 1,
    },
    loadingIndicator: {
        flex: 1,
        position: 'absolute',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 'auto',
        marginBottom: 'auto',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        justifyContent: 'center',
    },
    btnCenter: {
        position: 'absolute',
        zIndex: 100,
    },

    actionsTopLeft: {
        position: 'absolute',
        zIndex: 100,
        left: 10,
    },
    actionsTopRight: {
        position: 'absolute',
        zIndex: 100,
        right: 10,
    },
    actionsBottomRight: {
        position: 'absolute',
        zIndex: 100,
        right: 10,
    },
    overlay: {
        flex: 1,
        //backgroundColor: '#EEEEEE',
        //opacity: 0.5,
        height: '100%',
        position: "absolute",
        zIndex: 300,
        left: 0,
        top: 0,
        width: '100%'
    }
})

import MapView, {Geojson, Marker} from "react-native-maps";
import {View} from "react-native-ui-lib";
import React, {MutableRefObject, useCallback, useMemo} from "react";
import {observer} from "mobx-react";
import {StyleSheet, ViewStyle} from "react-native";
import {icons} from "~assets/icons-map"
import {COLORS, THEME_STYLE} from "~assets/design";
import {TDeliveryZonePolygon} from "@core/sale/types";
import {TOfficeView} from "@core/company/types";
import {MapViewProps} from "react-native-maps/lib/MapView";
import {LatLng, Region} from "react-native-maps/lib/sharedTypes";
import {Details} from "react-native-maps/lib/MapView.types";
import {useDebouncedCallback} from "use-debounce";
import {useStateRef} from "@core/main/lib/hooks/useStateRef";
import {UiBtn, UiBtnProps} from "~ui/btn";
import {useStores} from "~stores";

type MapDeliveryProps = MapViewProps & {
    offices?: TOfficeView[]
    zones?: TDeliveryZonePolygon[]
    selectedOffice?: TOfficeView
    layoutHeight: number
    onOfficeSelect?: (entity: TOfficeView) => void
    onZoom?: () => void
    markersRef?: any
    onZoneClick?: (zonePolygon: TDeliveryZonePolygon) => void
    controlsOffsetTop?: number
    controlsOffsetBottom?: number
}
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

export const MapDeliveryComponent: React.FC<MapDeliveryProps> = (props, ref: MutableRefObject<MapView>) => {

    const {
        offices,
        zones,
        layoutHeight,
        onOfficeSelect,
        markersRef,
        selectedOffice,
        initialCamera,
        initialRegion,
        onZoom,
        onZoneClick,
        controlsOffsetTop = 0,
        controlsOffsetBottom = 0,
        ...rest
    } = props

    const {geo, sale} = useStores()

    const [regionState, setRegionState, regionStateRef, updateRegionState] = useStateRef<Region>(() => {
        if (!initialRegion) {
            return {
                ...sale.getDeliveryZonesCenter().getGoogleData(),
                latitudeDelta: 0.20,
                longitudeDelta: 0.20,
            }
        } else {
            return initialRegion
        }
    })

    const sizeStyle: ViewStyle = {
        height: layoutHeight,
    }

    const onRegionChange = useDebouncedCallback((region: Region, details: Details) => {
        if (region.latitudeDelta !== regionStateRef.current.latitudeDelta || region.longitudeDelta !== regionStateRef.current.longitudeDelta) {
            onZoom && onZoom()
        }
        setRegionState(region)
    }, 300)

    const _onOfficeSelect = useCallback((office: TOfficeView) => {
        if (office.marker && ref.current) {
            if (regionStateRef.current.latitudeDelta > 0.065) {
                ref.current.animateToRegion({
                    ...office.marker.coordinate,
                    latitudeDelta: 0.065,
                    longitudeDelta: 0.065
                }, 300)
            }
        }
        onOfficeSelect && onOfficeSelect(office)
    }, [onOfficeSelect])

    const markers = useMemo(() => {
        return offices && offices.map((item) => {

            if (!item.marker)
                return <></>

            const baloonProps: any = {size: 50}
            const logoProps: any = {size: 20, color: '#ffffff'}

            if (selectedOffice && (item.entityId === selectedOffice.entityId)) {
                baloonProps.color = COLORS.primary
            } else {
                baloonProps.color = COLORS.primaryLighter
            }

            return <Marker
                {...item.marker}
                style={{zIndex: 10}}
                key={item.entityId}
                onPress={() => _onOfficeSelect(item)}
                ref={(ref) => markersRef ? markersRef.current[item.entityId] = ref : null}
            >
                <View style={styles.markerWrapper}>
                    {icons.baloon(baloonProps)}
                    <View style={styles.marker}>
                        {icons.logoMap(logoProps)}
                    </View>
                </View>
            </Marker>
        })
    }, [offices, _onOfficeSelect, selectedOffice])

    const zonesGeo = useMemo(() => {
        return zones && zones.map(item => item.polygon && <Geojson
            key={item.id}
            onPress={() => onZoneClick && onZoneClick(item)}
            {...item.polygon}
        />)
    }, [zones, onZoneClick])

    const onGeoposition = useCallback(async () => {
        const coords = await geo.getLocationCoords()
        if (coords) {
            const coordsData = coords.getArray()
            if (coordsData) {
                flyTo(coords.getGoogleData(), 15)
            }
        }
    }, [])

    const onShowAll = useCallback(async () => {

        const markersCoords = (offices || []).map((office) => {
            if (office.marker && office.marker?.coordinate) {
                return office.marker?.coordinate
            }
        }).filter(item => !!item) as LatLng[]

        ref.current.fitToCoordinates(markersCoords, {
            edgePadding: {
                top: 150,
                bottom: 60,
                left: 50,
                right: 50,
            },
            animated: true,
        });

    }, [])

    const flyTo = useCallback((coords: LatLng, zoom?: number, duration: number = 100) => {

        const newRegion: Partial<Region> = {
            ...coords,
        }

        if (zoom) {
            newRegion.latitudeDelta = 0.1 / zoom
            newRegion.longitudeDelta = 0.1 / zoom
        } else {
            newRegion.latitudeDelta = regionStateRef.current.latitude
            newRegion.longitudeDelta = regionStateRef.current.longitude
        }

        ref.current.animateToRegion(newRegion as Region, 100);
    }, [])

    const onZoomPlus = useCallback(() => {
        const newRegion = {
            latitude: regionStateRef.current.latitude,
            longitude: regionStateRef.current.longitude,
            latitudeDelta: regionStateRef.current.latitudeDelta / 2.5,
            longitudeDelta: regionStateRef.current.longitudeDelta / 2.5
        }
        updateRegionState(newRegion)
        ref.current.animateToRegion(newRegion, 100);
    }, [])

    const onZoomMinus = useCallback(() => {
        const newRegion = {
            latitude: regionStateRef.current.latitude,
            longitude: regionStateRef.current.longitude,
            latitudeDelta: regionStateRef.current.latitudeDelta * 2.5,
            longitudeDelta: regionStateRef.current.longitudeDelta * 2.5
        }
        updateRegionState(newRegion)
        ref.current.animateToRegion(newRegion, 100);
    }, [])

    return <View style={[sizeStyle, {position: 'relative'}]}>
        <MapView
            ref={ref}
            mapPadding={{top: 0, left: 0, right: 0, bottom: 0}}
            initialCamera={initialCamera}
            region={initialRegion}
            zoomEnabled={true}
            style={styles.mapStyle}
            onRegionChange={onRegionChange}
            {...rest}
        >
            {markers}
            {zonesGeo}
        </MapView>
        <View
            style={[styles.actionsTopRight, {top: controlsOffsetTop + 20}]}
            gap-10
        >
            <View gap-2>
                <UiBtn
                    icon={icons.plus}
                    {...defaultMapButtonProps}
                    onPress={onZoomPlus}
                />
                <UiBtn
                    icon={icons.minus}
                    {...defaultMapButtonProps}
                    onPress={onZoomMinus}
                />
            </View>
        </View>

        <View
            style={[styles.actionsBottomRight, {bottom: controlsOffsetBottom + 20}]}
            gap-10
            right
        >
            <UiBtn
                icon={icons.nav}
                {...defaultMapButtonProps}
                diameter={38}
                onPress={onGeoposition}
                loading={geo.getLocationCoords.pending}
            />

            {markers && markers.length > 1 && <UiBtn
                icon={icons.expand}
                {...defaultMapButtonProps}
                diameter={38}
                onPress={onShowAll}
            />}
        </View>

    </View>
}

// @ts-ignore
export const MapDelivery = observer(React.forwardRef<any, MapDeliveryProps>(MapDeliveryComponent))

const styles = StyleSheet.create({
    mapStyle: {
        flex: 1,
    },
    markerWrapper: {
        position: 'relative',
        shadowColor: '#000',
        shadowOffset: {
            width: 2,
            height: 4,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6,
    },
    marker: {
        position: 'absolute',
        top: 10,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center'
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
})

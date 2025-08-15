import MapView, {Geojson, Marker} from "react-native-maps";
import {View} from "react-native-ui-lib";
import React, {useState} from "react";
import {observer} from "mobx-react";
import {Camera} from "react-native-maps/lib/MapView.types";
import {StyleSheet, ViewStyle} from "react-native";
import {icons} from "~assets/icons-map"
import {COLORS, wHeight} from "~assets/design";
import {Region} from "react-native-maps/lib/sharedTypes";
import {TDeliveryZonePolygon} from "@core/sale/types";
import {TOfficeView} from "@core/company/types";

type TProps = {
    offices?: TOfficeView[]
    zones?: TDeliveryZonePolygon[]
    selectedOffice?: TOfficeView
    initialCamera?: Camera
    initialRegion?: Region
    layoutHeight: number
    onMapTouch?: () => void
    onOfficeSelect?: (entity: TOfficeView) => void
    onZoom?: () => void
    markersRef?: any
    onZoneClick?: (zonePolygon: TDeliveryZonePolygon) => void
}

export const MapComponent: React.FC<TProps> = (props, ref) => {

    const {
        offices,
        zones,
        layoutHeight,
        onMapTouch,
        onOfficeSelect,
        markersRef,
        selectedOffice,
        initialCamera,
        initialRegion,
        onZoom,
        onZoneClick
    } = props

    const [latDelta, setLatDelta] = useState<any>(initialRegion?.latitudeDelta)

    const sizeStyle: ViewStyle = {
        height: layoutHeight,
    }

    return <View style={[sizeStyle, {position: 'relative'}]}>

        <MapView
            ref={ref}
            mapPadding={{top: 0, left: 0, right: 0, bottom: wHeight / 3}}
            initialCamera={initialCamera}
            region={initialRegion}
            zoomEnabled={true}
            style={styles.mapStyle}
            onTouchStart={onMapTouch}
            onRegionChange={(region, details) => {
                if (details.isGesture && region.latitudeDelta !== latDelta) {
                    setLatDelta(region.latitudeDelta)
                    onZoom && onZoom()
                }
            }}
        >
            {
                offices && offices.map((item) => {
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
                        onPress={() => onOfficeSelect && onOfficeSelect(item)}
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
            }
            {
                zones && zones.map(item => item.polygon && <Geojson
                    key={item.id}
                    onPress={() => onZoneClick && onZoneClick(item)}
                    {...item.polygon}
                />)
            }
        </MapView>
    </View>
}

// @ts-ignore
export const Map = observer(React.forwardRef(MapComponent))

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
})

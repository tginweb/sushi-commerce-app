import React, {useCallback, useState} from "react"
import {StyleSheet} from "react-native"
import {MapYandex, MapYandexCenterComponent, MapYandexProps} from "~com/geo/map-yandex";
import {TGeoCoords} from "@core/geo/types";
import {useDebounceCallback} from "@core/main/lib/hooks/useDebounceCallback";
import {useStores} from "~stores";
import {GeoObject} from "~gql/api";
import {MapPointer} from "~com/geo/pointer";

export type MapAddressSelectProps = MapYandexProps & {
    onFindAddressStart?: () => void
    onFindAddressEnd?: () => void
    onFindAddress?: (obj: GeoObject | null) => void
    enable?: boolean
}

const MapAddressSelectComponent: React.FC<MapAddressSelectProps> = (props, ref) => {

    const {geo} = useStores()

    const {
        coords,
        onFindAddress,
        onPositionChange,
        onPositionChangeEnd,
        onDrag,
        enable = true,
        onFindAddressStart,
        onFindAddressEnd,
        ...rest
    } = props

    const [findAddressLoading, setFindAddressLoading] = useState<boolean>(false)

    const findAddressCall = useDebounceCallback(async (coords: TGeoCoords) => {
        const geoObject = await geo.locationByCoords(coords)
        onFindAddress && onFindAddress(geoObject)
        setFindAddressLoading(false)
        onFindAddressEnd && onFindAddressEnd()
    }, 1500)

    const findAddressWrapped = useDebounceCallback((coords: TGeoCoords) => {
        onFindAddressStart && onFindAddressStart()
        setFindAddressLoading(true)
        findAddressCall(coords)
    }, 1500)

    const findAddressCancel = useCallback(() => {
        findAddressCall.cancel()
        findAddressWrapped.cancel()
        setFindAddressLoading(false)
        onFindAddressEnd && onFindAddressEnd()
    }, [])

    const _onPositionChangeEnd = useCallback(async (coords: TGeoCoords) => {
        onPositionChangeEnd && onPositionChangeEnd(coords)
        if (enable) {
            findAddressCancel()
            findAddressWrapped(coords)
        }
    }, [
        findAddressCancel,
        onPositionChangeEnd
    ])

    const _onDrag = useCallback(async () => {
        findAddressCancel()
    }, [findAddressCancel])

    const pointerSize = 40

    const centerComponentRender: MapYandexCenterComponent = useCallback((
        {
            loading,
            dragging
        }
    ) => {
        return <MapPointer
            loading={loading}
            dragging={dragging}
            size={pointerSize}
        />
    }, [])

    return <MapYandex
        ref={ref}
        coords={coords}
        zoom={17}
        centerComponent={centerComponentRender}
        centerComponentWidth={pointerSize}
        positionLoading={findAddressLoading}
        onPositionChangeEnd={_onPositionChangeEnd}
        onDrag={_onDrag}
        {...rest}
    />
}

// @ts-ignore
export const MapAddressSelect = React.forwardRef(MapAddressSelectComponent)

const styles = StyleSheet.create({})

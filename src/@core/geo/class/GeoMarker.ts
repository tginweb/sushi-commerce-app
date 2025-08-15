import {TGeoCoords, TGeoMarkerCaption, TGeoMarkerOptions, TGeoMarkerProps, TMapMarkerYandexData} from "@core/geo/types";
import {GeoCoordinates} from "@core/geo/class/GeoCoordinates";

export class GeoMarker {

    id: string
    coords: GeoCoordinates
    props: TGeoMarkerProps
    options: TGeoMarkerOptions | null = {}
    selectedOptions?: TGeoMarkerOptions

    constructor(
        id: string,
        coords: TGeoCoords,
        props: TGeoMarkerProps = {},
        options: TGeoMarkerOptions = {},
        selectedOptions?: TGeoMarkerOptions
    ) {
        this.id = id
        this.coords = GeoCoordinates.toObject(coords)
        this.props = {
            ...props,
            id: id
        }
        this.initOptions(options, selectedOptions)
    }

    initOptions(options: TGeoMarkerOptions = {}, selectedOptions?: TGeoMarkerOptions) {
        this.options = options
        this.selectedOptions = selectedOptions
    }

    getYandexData(): TMapMarkerYandexData {
        return {
            id: this.id,
            coords: this.coords.getArray(),
            props: this.props,
            options: this.options,
            selectedOptions: this.selectedOptions,
        }
    }
}

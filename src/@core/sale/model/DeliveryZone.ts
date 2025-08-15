import {ElementModel} from "@core/main/model/Element";
import {DeliveryZoneElement} from "~gql/api";
import {makeObservable} from "mobx";
import hexRgb from "hex-rgb";
import {TGeoZone} from "@core/geo/types";

export class DeliveryZoneModel extends ElementModel {

    PROP_GEOJSON: any
    PROP_COLOR?: string
    PROP_FREE_FROM_PRICE?: number
    PROP_FREE_TEXT?: string
    PROP_OUTSIDE?: boolean
    PROP_PRICE_BY_DELIVERY?: number
    PROP_PRICE_BY_KM?: number
    PROP_PRICE_TEXT?: string

    constructor(data?: DeliveryZoneElement, observer: boolean = true) {
        super(null, false)
        if (data) {
            Object.assign(this as any, data)
            this.indexProps(this.PROPS)
        }
        if (observer)
            makeObservable(this)
    }

    getPolygons(selectedZone?: DeliveryZoneModel) {

        const result: TGeoZone<DeliveryZoneModel>[] = []

        const poligons = Array.isArray(this.PROP_GEOJSON) ? this.PROP_GEOJSON : [this.PROP_GEOJSON]

        let poligonIndex = 0

        for (const poligon of poligons) {

            poligonIndex++

            let fill = hexRgb(poligon.properties.fill)
            let strokeWidth = 1
            let strokeOpacity = 1
            let strokeColor = poligon.properties.fill

            const activeZoneId = 0

            fill.alpha = 0.7

            if (selectedZone) {
                if (selectedZone.ID === this.ID) {
                    strokeWidth = 4
                } else {
                    fill.alpha = 0.5
                }
            }

            const data: TGeoZone<DeliveryZoneModel> = {
                id: this.ID + '-' + poligonIndex,
                entityId: this.ID,
                entity: this,
                polygon: {
                    fillColor: 'rgba(' + fill.red + ',' + fill.green + ',' + fill.blue + ',' + fill.alpha + ')',
                    strokeColor: strokeColor,
                    strokeWidth,
                    geojson: {
                        type: 'FeatureCollection',
                        features: [
                            {
                                type: 'Feature',
                                geometry: {
                                    type: 'Polygon',
                                    coordinates: [
                                        poligon.geometry.coordinates[0].map((coord: any) => ([coord[0], coord[1]]))
                                    ],
                                },
                                properties: {},
                            },
                        ],
                    }
                },
            }

            result.push(data)
        }

        return result
    }
}


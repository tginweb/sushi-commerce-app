import {computed, observable} from "mobx";
import {CourierState} from "~gql/api";
import {TGeoCoords} from "@core/geo/types";
import {GeoCoordinates} from "@core/geo/class/GeoCoordinates";
import {GeoMarker} from "@core/geo/class/GeoMarker";
import {logComputed} from "@core/main/lib/mobx/log-computed";

export class CourierStateModel {

    @observable
    COORDS?: TGeoCoords

    @observable
    ARRIVAL_TIME_CAPTION?: string

    @observable
    ARRIVAL_TIME?: string

    @observable
    CAR_COLOR?: string

    @observable
    CAR_NUMBER?: string

    constructor(data: CourierState, observer: boolean = true) {
        Object.assign(this as any, data)
    }

    @computed
    get coordsObject() {
        logComputed(this, 'coordsObject')
        return this.COORDS ? new GeoCoordinates(this.COORDS) : null
    }

    @computed
    get marker() {
        logComputed(this, 'marker')
        return this.coordsObject ? new GeoMarker(
            'driver',
            this.coordsObject,
            {},
            {
                iconLayout: 'default#image',
                iconImageHref: 'https://irkutsk.sushi-studio.ru/images/mobile-app/car.svg',
                iconImageSize: [55, 70],
                iconCaption: 'ВОДИТЕЛЬ'
            },
        ) : null
    }
}






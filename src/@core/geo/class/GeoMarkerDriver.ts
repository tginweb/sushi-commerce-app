import {TGeoMarkerOptions} from "@core/geo/types";
import {GeoMarker} from "@core/geo/class/GeoMarker";

export class GeoMarkerDriver extends GeoMarker {

    initOptions(options: TGeoMarkerOptions = {}, selectedOptions?: TGeoMarkerOptions) {
        this.options = {
            iconLayout: 'default#image',
            iconImageHref: 'https://irkutsk.sushi-studio.ru/images/mobile-app/car.svg',
            iconImageSize: [55, 70],
            iconImageOffset: [-20, -55],
            iconCaption: 'АДРЕС',
            ...options,
        }
        this.selectedOptions = {
            iconLayout: 'default#image',
            iconImageHref: 'https://irkutsk.sushi-studio.ru/images/mobile-app/car.svg',
            iconImageSize: [55, 70],
            iconImageOffset: [-20, -55],
            iconCaption: 'АДРЕС',
            ...selectedOptions
        }
    }
}

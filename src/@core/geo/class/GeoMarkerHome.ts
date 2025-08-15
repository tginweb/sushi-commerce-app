import {TGeoMarkerOptions} from "@core/geo/types";
import {GeoMarker} from "@core/geo/class/GeoMarker";
import {Platform} from "react-native";

export class GeoMarkerHome extends GeoMarker {


    initOptions(options: TGeoMarkerOptions = {}, selectedOptions?: TGeoMarkerOptions) {

        const iconImageSize = Platform.OS === 'ios' ? [40, 60] : [40, 46]
        const iconImageOffset = Platform.OS === 'ios' ? [-20, -55] : [-20, -44]

        this.options = {
            iconLayout: 'default#imageWithContent',
            iconImageHref: 'https://irkutsk.sushi-studio.ru/images/mobile-app/home-light.svg',
            iconImageSize,
            iconImageOffset,
            iconCaption: 'АДРЕС',
            ...options,
        }
        this.selectedOptions = {
            iconLayout: 'default#imageWithContent',
            iconImageHref: 'https://irkutsk.sushi-studio.ru/images/mobile-app/home-filled.svg',
            iconImageSize,
            iconImageOffset,
            iconCaption: 'АДРЕС',
            ...selectedOptions
        }
    }
}

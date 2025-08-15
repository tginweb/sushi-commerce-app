import {OrderStatus} from "~gql/api";
import {RefObject} from "react";
import {View as NativeView} from "react-native";
import {MapYandexApi} from "~com/geo/map-yandex";
import {UiBottomSheetMethods} from "~ui/bottom-sheet";

export type TOrderStatusExtended = OrderStatus & {
    CURRENT: boolean
    DONE: boolean
    COLOR_STROKE: string
    COLOR_FILL: string
    READY: boolean
    ICON: string
    FIRST: boolean
    LAST: boolean
}

export type TComponentRefs = {
    layout: RefObject<NativeView>
    map: RefObject<MapYandexApi>
    modal: RefObject<UiBottomSheetMethods>
}

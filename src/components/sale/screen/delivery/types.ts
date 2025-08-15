import {TDeliveryZoneDetailView, TDeliveryZoneView} from "@core/sale/types";
import {TOfficeDetailView, TOfficeView} from "@core/company/types";

export type TTab = 'delivery' | 'pickup' | 'bar'

export type TMode = 'list' | 'item'

export type TViewType = 'zone' | 'office'

export type TDeliveryView = TDeliveryZoneView | TOfficeView

export type TDeliveryDetailView = TDeliveryZoneDetailView | TOfficeDetailView

export type TFilters = {
    worktime: boolean
}

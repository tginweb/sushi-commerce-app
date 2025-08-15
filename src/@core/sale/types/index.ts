import {BasketItemModel} from "../model/BasketItem";
import {ProductModel} from "@core/catalog/model/Product";
import {SpecialOfferModel} from "@core/sale/model/SpecialOffer";
import {
    BasketItemProp,
    BonusLevelElement,
    DeliveryZoneElement,
    Order,
    OrderAttr,
    OrderProfile,
    OrderStatus,
    ProductElement,
    SaleClientCard,
    Vorder,
    VOrderReserve
} from "~gql/api";
import VorderSectionDialogStore from "@core/sale/store/vorder/section-dialog";
import {TAction, TCommonDialogProps, TValidateResult} from "@core/main/types";
import {TGeoMarker, TGeoZone} from "@core/geo/types";
import {DeliveryZoneModel} from "@core/sale/model/DeliveryZone";
import {UiListItemProps} from "~ui/list-item";
import {ImageSourcePropType} from "react-native";

export type TBasketItemCalculation = {
    priceDiscounted: number
    priceTotalDiscounted: number
    discountPercent: number
}

export type TBasketItemCalculated = {
    model: BasketItemModel
    calc: TBasketItemCalculation
}

export type TBasketState = {
    TS: string,
    SYNCED: boolean
    PRICE: number
    ITEMS: BasketItemModel[]
    WEIGHT: number
    COUNT: number
    QUANTITY: number
    MIN_PRICE: number
    MIN_PRICE_REACHED: boolean
    OFFERS: SpecialOfferModel[]
}

export type TOrderAttrsMap = {
    [key: string]: OrderAttr;
}

export type TBasketOpAdd = {
    action: 'add',
    basketId?: number
    product?: ProductModel
    productId: number
    productHash?: string
    quantity: number
    inputProps?: Record<string, any>
    props?: Record<string, BasketItemProp>
    constructorType?: string
    constructorBundle?: any
}

export type TBasketOpAddConstructor = {
    action: 'add-constructor',
    constructor: any
    sectionId: number
    sectionCode: string
}

export type TBasketOpSetQuantity = {
    action: 'quantity',
    basketId?: number
    productId?: number
    quantity: number
}

export type TBasketOpDelete = {
    action: 'delete',
    basketId?: number
    productId?: number
}

export type TBasketOpClear = {
    action: 'clear',
}

export type TBasketItemsModelMap = {
    [key: string | number]: BasketItemModel
}

export type TDeliveryRequest = {
    result: TDeliveryRequestResult
    resultDefault: TDeliveryRequestResult
}

export type TDeliveryRequestResult = {
    timestamp?: number
    success?: boolean
    status?: string
    messages?: any
    timeAvailable?: number
    departmentId?: number
    departmentName?: string
    departmentServiceId?: number
    departmentServiceName?: string
    deliveryPrice?: number
    deliveryFreeFromPrice?: number
    minPrice?: number
}


export type TGqlScopeSaleApp = {
    deliveryZones: DeliveryZoneElement[]
    orderStatuses: OrderStatus[]
    bonusLevels: BonusLevelElement[]
}

export type TGqlScopeSaleSession = {
    profiles: OrderProfile[]
    ordersActive: Order[]
}

export type TGqlScopeSaleUser = {
    clientCard: SaleClientCard
}

export type TGqlScopeVorderSession = {
    basketProducts: ProductElement[]
    vorder: Vorder
    favs: any
}

export type TBenefitType = {
    NAME_SHORT?: string
    NAME_OF: string
    NAME_IN: string
    BADGE?: any
    VALUE: TBenefitTypeValue
    ICON: any

    NAME: string
    CAPTION?: string
    VALUE_VIEW?: any
}

export type TVorderContext = {
    openSection: (name: any, params?: any) => void
}

export type TBenefitTypeValue = 'discount' | 'bonus' | 'coupon'

export type VorderDialogId = keyof VorderDialogs

export type VorderSectionDialogProps = TCommonDialogProps & {}

export type VorderBenefitDialogProps = VorderSectionDialogProps & {
    benefitType: TBenefitTypeValue
}

export type VorderPickupDialogProps = VorderSectionDialogProps & {
    viewmode: 'list' | 'map'
}

export type VorderDialogs = {
    delivery: VorderSectionDialogStore<VorderSectionDialogProps>
    time: VorderSectionDialogStore<VorderSectionDialogProps>
    pickup: VorderSectionDialogStore<VorderPickupDialogProps>
    benefit: VorderSectionDialogStore<VorderBenefitDialogProps>
    payment: VorderSectionDialogStore<VorderSectionDialogProps>
    cultery: VorderSectionDialogStore<VorderSectionDialogProps>
    comment: VorderSectionDialogStore<VorderSectionDialogProps>
    confirm: VorderSectionDialogStore<VorderSectionDialogProps>
}

export type VorderValidateResults = {
    person: TValidateResult
    delivery: TValidateResult
    time: TValidateResult
    pickup: TValidateResult
    payment: TValidateResult
    cultery: TValidateResult
    comment: TValidateResult
    confirm: TValidateResult
    benefit: TValidateResult
}

export type TVorderVaidateContext = {
    openedDialog?: keyof VorderDialogs
}

export type TBasketInputProps = Record<string, any>

export type TDeliveryDuration = {
    fetchTime: number,
    minutes: number
}

export type TDeliveryReserveProps = {
    onSuccess?: (res: VOrderReserve) => void
}

export type TDeliveryZonePolygon = TGeoZone<DeliveryZoneModel>

export type TDeliveryZoneView = TGeoMarker<DeliveryZoneModel> & {
    type: 'zone'
}

export type TDeliveryZoneDetailView = TDeliveryZoneView & {
    fields: UiListItemProps[]
    gallery: ImageSourcePropType[]
}

export type TSaleEventPayloadOrderUpdate = {
    order: Order
}

export type TSaleEventPayloadOrderUpdatePartial = {
    orderId: number
    order: Partial<Order>
}

export type TActionSale =
    TSaleActionReloadProfiles
    | TActionSaleReloadClientCard
    | TActionSaleReloadOrdersActive
    | TActionSaleReloadOrdersHistory
    | TActionSaleOrderView


export type TActionSaleReloadClientCard = TAction & {
    channel: 'sale'
    type: 'reloadClientCard'
}

export type TSaleActionReloadProfiles = TAction & {
    channel: 'sale'
    type: 'reloadProfiles'
}

export type TActionSaleOrderView = TAction & {
    channel: 'sale'
    type: 'orderView'
    payload: number
}

export type TActionSaleReloadOrdersActive = TAction & {
    channel: 'sale'
    type: 'reloadActiveOrders'
}

export type TActionSaleReloadOrdersHistory = TAction & {
    channel: 'sale'
    type: 'reloadHistoryOrders'
}


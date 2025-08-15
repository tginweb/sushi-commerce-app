import {BasketItemModel} from "./BasketItem"
import {action, computed, makeObservable, observable, runInAction} from "mobx"
import {OrderableModel} from "@core/sale/model/Orderable"
import {Coupon, DeliveryService, Order, OrderAttr, OrderCancelReason} from "~gql/api"
import {GeoCoordinates} from "@core/geo/class/GeoCoordinates"
import {CourierStateModel} from "@core/sale/model/CourierState"
import {task} from "../../main/lib/decorator/task";
import API_ORDER_PAY, {TQueryOrderPayOnlineTask} from "@core/sale/gql/query/order_pay"
import API_ORDER_CANCEL, {TOrderCancelTask} from "@core/sale/gql/mutation/order_cancel"
import {CompanyOfficeModel} from "@core/company/model/CompanyOffice";
import {parseTime} from "@core/main/util/date";
import {formatTime} from "@core/main/util/date/formatTime";
import {TBenefitTypeValue} from "@core/sale/types";
import {logComputed} from "@core/main/lib/mobx/log-computed";

export class OrderModel extends OrderableModel {

    ID: number = 0
    ACCOUNT_NUMBER: string = ''
    URL: string = ''
    DATE_INSERT: any = null
    USER_ID: number = 0

    @observable
    STATUS_ID: string = ''

    @observable
    STATUS_NAME: string = ''

    @observable
    STATUS_COLOR: string = ''

    @observable
    CSTATUS_ID: string = ''

    @observable
    CSTATUS_NAME: string = ''

    @observable
    CSTATUS_COLOR: string = ''

    @observable
    PAYSYSTEM_IS_ONLINE: boolean | null = null

    @observable
    IS_CAN_CANCEL: boolean | null = null

    @observable
    IS_PAID: boolean | null = null

    @observable
    IS_ACTIVE: boolean | null = null

    @observable
    IS_CANCELED: boolean | null = null

    @observable
    IS_FINISHED: boolean | null = null

    @observable
    IS_CAN_PAY: boolean | null = null

    @observable
    IS_CAN_PAY_ONLINE: boolean | null = null

    @observable
    IS_CAN_PAY_BILL: boolean | null = null

    @observable
    COUPONS: Coupon[] = []

    @observable
    BONUSES: number = 0

    @observable
    PRICE: number = 0

    @observable
    PRICE_BASKET: number = 0

    @observable
    PRICE_BASKET_BASE: number = 0

    @observable
    PRICE_DISCOUNT: number = 0

    @observable
    PRICE_DELIVERY: number = 0

    @observable
    PRICE_DELIVERY_BASE: number = 0

    @observable
    PRICE_TOTAL: number = 0

    @observable
    PRICE_PAY: number = 0

    @observable
    PRICE_PAY_BASE: number = 0

    USER_DESCRIPTION: string = ''

    BASKET: BasketItemModel[] = []
    ATTRS: OrderAttr[] = []

    DELIVERY?: DeliveryService
    PICKUP_DEPARTMENT?: CompanyOfficeModel

    COURIER_STATE?: CourierStateModel
    CANCEL_REASONS: OrderCancelReason[] = []

    constructor(data: Order, observer: boolean = true) {
        super()
        this.isObservable = observer
        this.fill(data, observer)
        if (observer) {
            makeObservable(this)
        }
    }

    @action
    fill(data: Order, observer?: boolean) {

        observer = typeof observer !== 'undefined' ? observer : this.isObservable

        Object.assign(this as any, data)

        if (data.BASKET)
            this.BASKET = data.BASKET.map((item) => new BasketItemModel(item, observer))

        if (data.COURIER_STATE)
            this.COURIER_STATE = new CourierStateModel(data.COURIER_STATE, observer)

        if (data.PICKUP_DEPARTMENT)
            this.PICKUP_DEPARTMENT = new CompanyOfficeModel(data.PICKUP_DEPARTMENT, observer)

        this.indexAttrs(this.ATTRS)
    }

    @computed
    get deliveryDateTime() {
        logComputed(this, 'deliveryDateTime')
        return this.attrValue['DATE'] && this.attrValue['TIME'] ? this.attrValue['DATE'] + ' ' + this.attrValue['TIME'] : null
    }

    @computed
    get deliveryTimeView() {
        logComputed(this, 'deliveryTimeView')
        return formatTime({
            value: this.deliveryTimeDayJs,
            splitter: 'в'
        }).datetimeFormatted
    }

    @computed
    get deliveryTimeDayJs() {
        logComputed(this, 'deliveryTimeDayJs')
        return parseTime(this.deliveryDateTime, 'datetime', 'object')
    }

    @computed
    get deliveryDateFormattedView() {
        logComputed(this, 'deliveryDateFormattedView')
        return this.deliveryDateTime
    }

    @computed
    get haveDetails() {
        logComputed(this, 'haveDetails')
        return this.attrValue['DETAILS'] === 'Y'
    }

    @computed
    get transportType() {
        logComputed(this, 'transportType')
        return this.DELIVERY?.TRANSPORT_TYPE
    }

    @computed
    get transportTypeName() {
        return this.isTransportTypeCourier ? 'доставка' : 'самовывоз'
    }

    @computed
    get houseCoordsObject() {
        logComputed(this, 'houseCoordsObject')
        return this.attrValue['HOUSE_COORDS'] ? new GeoCoordinates(this.attrValue['HOUSE_COORDS']) : null
    }

    @computed
    get isTransportTypeCourier() {
        logComputed(this, 'isTransportTypeCourier')
        return this.transportType === 'courier'
    }

    @action
    apiQueryPay = (async (variables = {}) => {
        try {
            const res = await API_ORDER_PAY.request({
                fetchPolicy: 'no-cache',
                variables: {
                    ...variables,
                    id: this.ID,
                }
            }, {
                throwError: true
            })
            if (res && res.state.success) {
                if (res.payload?.order) {
                    runInAction(() => {
                        this.stores().sale.mergeActiveOrder(res.payload?.order)
                    })
                }
            }
            return res
        } catch (e) {
            console.log(e)
        }
    }) as TQueryOrderPayOnlineTask

    @task
    apiMutateCancel = (async (variables) => {
        try {
            const res = await API_ORDER_CANCEL.request({
                variables: {
                    ...variables,
                    id: this.ID,
                }
            }, {
                throwError: true
            })
            return res
        } catch (e) {
            console.log(e)
        }
    }) as TOrderCancelTask

    @computed
    get isCourierStateVisible() {
        logComputed(this, 'isCourierStateVisible')
        return this.IS_ACTIVE && this.COURIER_STATE && this.COURIER_STATE.ARRIVAL_TIME
    }

    @computed
    get benefitType(): TBenefitTypeValue {
        logComputed(this, 'benefitType')
        return this.attrValue['BENEFIT_TYPE']
    }

    @computed
    get bonuses() {
        logComputed(this, 'bonuses')
        return this.attrValue['BONUSES'] || 0
    }
}






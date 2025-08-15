import {action, autorun, computed, makeObservable, observable, runInAction} from "mobx"
import {
    TBasketItemCalculated,
    TBasketItemCalculation,
    TBasketItemsModelMap,
    TBasketOpAdd,
    TBasketOpAddConstructor,
    TBasketOpClear,
    TBasketOpDelete,
    TBasketOpSetQuantity,
    TBasketState,
    TBenefitType,
    TBenefitTypeValue,
    TDeliveryDuration,
    TDeliveryRequest,
    TDeliveryReserveProps,
    TGqlScopeVorderSession,
    TVorderVaidateContext,
    VorderBenefitDialogProps,
    VorderDialogs,
    VorderPickupDialogProps,
    VorderSectionDialogProps,
    VorderValidateResults
} from "@core/sale/types";
import {IStore, TMaybe, TValidateErrors, TValidateRules} from "@core/main/types";
import {OrderableModel} from "@core/sale/model/Orderable";
import {OrderProfileModel} from "@core/sale/model/OrderProfile";
import {ElementModel} from "@core/main/model/Element";
import {parseTime, timestampToFormat} from "@core/main/util/date";
import {
    Basket,
    BasketItem,
    BasketItemProp,
    DeliveryComputed,
    DeliveryService,
    DiscountCondition,
    MutationSalePubVorderApplyArgs,
    MutationSalePubVorderCouponArgs,
    MutationSalePubVorderReserveArgs,
    MutationSalePubVorderSubmitArgs,
    Order,
    OrderAttrOption,
    QuerySalePubVorderArgs,
    Vorder,
    VOrderCoupon,
    VorderForm,
    VorderInput,
    VOrderReserve
} from "~gql/api";
import {Task, task} from "@core/main/lib/decorator/task"
import {SpecialOfferModel} from "@core/sale/model/SpecialOffer";
import {BasketItemModel} from "@core/sale/model/BasketItem";
import {ProductModel} from "@core/catalog/model/Product";
import getBasketPropsHash from "@core/sale/util/getBasketPropsHash";
import {busService} from "@core/main/service/bus";
import cashMoneyOptions from "@core/sale/util/cashMoneyOptions";
import randID from "@core/main/util/base/randID";
import {OrderModel} from "@core/sale/model/Order";
import {DiscountItemModel} from "@core/sale/model/DiscountItemModel";
import {TCatalogUpSaleProps, TProductCalculation} from "@core/catalog/types";
import {classComputedPropsCache} from "@core/main/lib/mobx/class-computed-props-cache";
import VorderSectionDialogStore from "@core/sale/store/vorder/section-dialog";
import icons from "~assets/icons-map";
import testRules from "@core/main/util/validate/testRules";
import {VOrderLocalArgs} from "@core/sale/gql/fragment/Vorder";
import MUTATION_VORDER_COUPON from "@core/sale/gql/mutation/vorder_coupon";
import MUTATION_VORDER_RESERVE from "@core/sale/gql/mutation/vorder_reserve";
import MUTATION_VORDER_SUBMIT, {TVorderSubmitTask} from "@core/sale/gql/mutation/vorder_submit";
import MUTATION_VORDER_APPLY, {TVorderApplyTask} from "@core/sale/gql/mutation/vorder_apply";
import QUERY_VORDER, {TQueryVorderTask} from "@core/sale/gql/query/vorder";

import dayjs from "dayjs";
import SaleConfig from "@core/sale/config";
import debounce from "lodash/debounce";
import {logComputed} from "@core/main/lib/mobx/log-computed";
import {UiSegmentProps} from "~ui/segments";
import plural from "plural-ru";
import {GeoCoordinates} from "@core/geo/class/GeoCoordinates";
import checkPhone from "@core/main/util/validate/checkPhone";
import toInt from "@core/main/util/base/toInt";
import {ProgressBar, Text, View} from "react-native-ui-lib";
import React from "react";
import {COLORS, SPACE} from "~assets/design";

const TIMEOUT_DEFAULT = 10000
const BASKET_TIMEOUT_DEFAULT = 10000

export class VorderStore extends OrderableModel implements IStore {

    @observable
    vorderId: number = 0

    @observable
    basket: TBasketState = {
        TS: '',
        SYNCED: false,
        PRICE: 0,
        WEIGHT: 0,
        COUNT: 0,
        QUANTITY: 0,
        MIN_PRICE: 0,
        MIN_PRICE_REACHED: false,
        ITEMS: [],
        OFFERS: []
    }

    @observable
    order: Order = {
        PRICE: 0,
        PRICE_BASKET: 0,
        PRICE_BASKET_BASE: 0,
        PRICE_DISCOUNT: 0,
        PRICE_DELIVERY: 0,
        PRICE_TOTAL: 0,
        PRICE_PAY: 0,
        DELIVERY_CALCULATED: false,
        BONUSES: 0,
        COUPONS: [],
    }

    @observable
    form: Omit<VorderForm, 'DISCOUNTS' | 'SPECIAL_OFFERS'> & {
        DISCOUNTS: DiscountItemModel[],
        SPECIAL_OFFERS: SpecialOfferModel[]
    } = {
        BONUSES_AVAILABLE: 0,
        COUPONS: [],
        COUPON_CAN_ADD: false,
        ATTRS: [],
        PAYSYSTEMS: [],
        DELIVERIES: [],
        COMPANIES: [],
        DEPARTMENTS: [],
        PAYCARDS: [],
        PERSON_TYPES: [],
        PROFILES: [],
        PROPS: [],
        DISCOUNT: undefined,
        DISCOUNTS: [],
        SPECIAL_OFFERS: []
    }

    @observable
    deliveryRequest: TDeliveryRequest = {
        result: {
            success: undefined,
            status: undefined,
            timestamp: 0,
            messages: [],
            timeAvailable: undefined,
            deliveryPrice: 0,
            deliveryFreeFromPrice: 0
        },
        resultDefault: {
            success: undefined,
            status: undefined,
            timestamp: 0,
            messages: [],
            timeAvailable: undefined,
            deliveryPrice: 0,
            deliveryFreeFromPrice: 0
        },
    }

    @observable
    vorderWasOpened: boolean = false

    @observable
    guestMode: boolean = false

    @observable
    lastTriggerPrice: number = 0

    @observable
    synced = false

    @observable
    syncTimeout: number = TIMEOUT_DEFAULT

    @observable
    syncHandler: any = null

    @observable
    basketSynced = false

    @observable
    basketSyncTimeout: number = BASKET_TIMEOUT_DEFAULT

    @observable
    basketSyncCurrentTimeout: number = 0

    @observable
    basketSyncHandler: any = null

    @observable
    basketItemByProductId: Record<number, BasketItemModel> = {}

    @observable
    basketModal: {
        visible: boolean,
        params: {}
    } = {
        visible: false,
        params: {}
    }

    @observable
    wokBasket: any = {}

    @observable
    data = ''

    @observable
    deliveryDuration: Record<any, TDeliveryDuration> = {}

    @observable
    deliveryDurationByProfile: Record<any, TDeliveryDuration> = {}

    @observable
    dialogs: VorderDialogs

    @observable
    openedDialogCode: string | null = null

    @observable
    validateResult: VorderValidateResults = {
        person: null,
        delivery: null,
        pickup: null,
        payment: null,
        time: null,
        benefit: null,
        cultery: null,
        comment: null,
        confirm: null,
    }

    @observable
    deliveryPriceCalculated: boolean = false

    @task
    apiReload = (async (variables: QuerySalePubVorderArgs) => {
        const withVars = {
            withVorderForm: true,
            withVorderBasket: true,
            withVorderOrder: true,
        }
        try {
            const res = await QUERY_VORDER.request({
                variables: {
                    ...variables,
                    ...withVars
                }
            })
            runInAction(() => {
                this.setVorder(res)
            })
            return res
        } catch (e) {
            console.log(e)
        }
    }) as TQueryVorderTask

    @task
    apiMutateApply = (async (variables: MutationSalePubVorderApplyArgs & VOrderLocalArgs) => {
        const withVars = {
            withVorderForm: true,
            withVorderBasket: true,
            withVorderOrder: true,
        }
        try {
            const res = await MUTATION_VORDER_APPLY.request({
                variables: {
                    ...variables,
                    order: this.getPayload(),
                    ...withVars
                },
            }, {
                throwError: true
            })
            console.log('VORDER apply success')

            /*
            runInAction(() => {
                if (res.state?.success) {

                }
            })
             */
            return res
        } catch (e) {
            console.log(e)
        }
    }) as TVorderApplyTask

    // TASKS
    @task
    apiMutateCoupon = (async (variables: MutationSalePubVorderCouponArgs & VOrderLocalArgs) => {
        const withVars = {
            withVorderForm: true,
            withVorderBasket: true,
            withVorderOrder: true,
        }
        try {
            const res = await MUTATION_VORDER_COUPON.request({
                variables: {
                    ...variables,
                    order: this.getPayload(),
                    ...withVars
                }
            })
            if (res.state.success) {
                if (variables.action === 'delete') {
                    runInAction(() => {
                        this.form.COUPONS = []
                    })
                } else if (variables.action === 'apply') {
                    const coupon = res.payload?.coupon
                    if (coupon) {
                        runInAction(() => {
                            this.form.COUPONS = [coupon]
                        })
                    }
                }
            }
            return res
        } catch (e) {
            console.log(e)
        }
    }) as Task<[MutationSalePubVorderCouponArgs], VOrderCoupon>

    @task
    apiMutateReserve = (async (variables: MutationSalePubVorderReserveArgs & VOrderLocalArgs) => {
        //return false
        const withVars = {
            withVorderForm: true,
            withVorderBasket: true,
            withVorderOrder: true,
        }
        try {
            const res = await MUTATION_VORDER_RESERVE.request({
                variables: {
                    ...variables,
                    order: this.getPayload(),
                    ...withVars
                }
            })
            runInAction(() => {
                // this.setVorder(result.payload?.entity as IVorderState, true)
            })
            return res
        } catch (e) {
        }
    }) as Task<[MutationSalePubVorderReserveArgs], VOrderReserve>

    @task
    apiMutateSubmit = (async (variables: MutationSalePubVorderSubmitArgs & VOrderLocalArgs) => {
        //return false
        const withVars = {
            withVorderForm: true,
            withVorderBasket: true,
            withVorderOrder: true,
        }
        try {
            const res = await MUTATION_VORDER_SUBMIT.request({
                variables: {
                    ...variables,
                    order: this.getPayload(),
                    ...withVars
                }
            })
            runInAction(() => {
                if (res.state.success) {

                }
            })
            return res
        } catch (e) {
            console.log(e)
        }
    }) as TVorderSubmitTask
    @observable
    prevDeliveryIsPaid: boolean = false
    @observable
    needReserveAgainProfile: number = 0
    basketCloseReason: TMaybe<'redirect'>

    constructor() {
        super()

        this.dialogs = {
            delivery: new VorderSectionDialogStore(this),
            benefit: new VorderSectionDialogStore(this),
            pickup: new VorderSectionDialogStore(this),
            cultery: new VorderSectionDialogStore(this),
            time: new VorderSectionDialogStore(this),
            payment: new VorderSectionDialogStore(this),
            comment: new VorderSectionDialogStore(this),
            confirm: new VorderSectionDialogStore(this)
        }

        makeObservable(this)
        //makeAutoObservable(this)
        //busService.emitter.on('basket.updated', () => this.onBasketUpdated())
    }

    @computed get ssss() {
        return 'zzz'
    }

    @computed get timeModeNearest() {
        logComputed(this, 'timeModeNearest')
        return !this.attrValue['TIME_MODE'] || this.attrValue['TIME_MODE'] === 'nearest'
    }

    @computed get profileId() {
        logComputed(this, 'profileId')
        return toInt(this.attrValue['PROFILE_ID'])
    }

    @computed
    get mapCoords(): GeoCoordinates | undefined {
        logComputed(this, 'mapCoords')
        const coordsStr = this.attrValue['HOUSE_COORDS'] || this.attrValue['STREET_COORDS']
        if (coordsStr) {
            return new GeoCoordinates(coordsStr)
        }
    }

    @computed get comp1() {
        return this.data + 'sss'
    }

    @computed get comp() {

        this.comp1
        return this.data + 'sss'
    }

    @computed get specialOffersFiltered() {
        logComputed(this, 'specialOffersFiltered')
        const products: ProductModel[] = this.stores().catalog.requiredPriceProducts
        return products.filter((product) => {
            if (product.REQUIRED_MIN_PRICE && this.priceBasketWithoutSpecial >= product.REQUIRED_MIN_PRICE) {
                if (!this.basketItemsByProductId[product.ID])
                    return true
            }
            return false
        })
    }

    @computed get basketItems(): BasketItemModel[] {
        logComputed(this, 'basketItems')
        return this.basket.ITEMS
    }

    @computed get basketItemsByProductId(): TBasketItemsModelMap {
        logComputed(this, 'basketItemsByProductId')
        return this.basketItems.reduce((map: TBasketItemsModelMap, item) => {
            map[item.PRODUCT_ID] = item
            return map
        }, {})
    }

    @computed get basketIsEmpty() {
        logComputed(this, 'basketIsEmpty')
        return !this.basketCount
    }

    @computed get basketNotEmpty() {
        logComputed(this, 'basketNotEmpty')
        return !!this.basketCount
    }

    @computed get priceTotal() {
        logComputed(this, 'priceTotal')
        return this.priceBasket + this.priceDelivery
    }

    @computed get priceTotalBase() {
        logComputed(this, 'priceTotalBase')
        return this.priceBasketBase + this.priceDeliveryBase
    }

    @computed get pricePay() {
        logComputed(this, 'pricePay')
        let res = 0
        if (this.bonusesBenefited) {
            res = this.priceTotal - this.bonusesBenefited
        } else {
            res = this.priceTotal
        }
        return Math.round(res)
    }

    @computed get basketWeight(): number {
        logComputed(this, 'basketWeight')
        if (this.basketItems.find(item => !item.product.weight))
            return 0
        return this.basketItems.reduce((res, item) => {
            if (item.product) {
                res += item.product.weight * item.QUANTITY
            }
            return res
        }, 0)
    }

    @computed get basketItemsCalculated(): TBasketItemCalculated[] {
        logComputed(this, 'basketItemsCalculated')
        return this.basketItems.map((item) => this.getBasketItemCalculated(item))
    }

    @computed get priceBasketWithoutSpecial() {
        logComputed(this, 'priceBasketWithoutSpecial')
        return this.basketItemsCalculated.reduce((price, item) => {
            if (!item.model.product || !item.model.product.REQUIRED_MIN_PRICE) {
                price += item.calc.priceTotalDiscounted
            }
            return price
        }, 0)
    }

    @computed get priceBasketBase() {
        logComputed(this, 'priceBasketBase')
        return this.basketItems.reduce((price, item) => {
            price += item.finalPriceBase
            return price
        }, 0)
    }

    @computed get priceBasket() {
        logComputed(this, 'priceBasket')
        return Math.round(this.basketItemsCalculated.reduce((price, item) => {
            price += item.calc.priceTotalDiscounted
            return price
        }, 0))
    }

    @computed
    get deliveryUntilFreeFromPrice() {
        return this.deliveryFreeFromPrice - this.priceBasketBase
    }

    @computed
    get deliveryFreeFromPrice() {
        logComputed(this, 'deliveryFreeFromPrice')
        if (this.isTransportCourier) {
            return this.attrValue['DELIVERY_FREE_FROM_PRICE'] ? this.attrValue['DELIVERY_FREE_FROM_PRICE'] : SaleConfig.SALE_DELIVERY_FREE_FROM_PRICE
        }
        return 0
    }

    @computed
    get priceDeliveryBase() {
        logComputed(this, 'priceDeliveryBase')
        return this.priceBasket < this.deliveryFreeFromPrice ? this.deliveryFreeFromPrice - this.priceBasket : 0
        //return this.priceBasketBase < this.deliveryFreeFromPrice ? this.deliveryFreeFromPrice - this.priceBasketBase : 0
    }

    @computed
    get priceDelivery() {
        return this.priceDeliveryBase
        /*
        if (!this.priceDeliveryBase) return 0
        const discount = this.discountBestBenefited
        return discount ? this.applyPricePercent(this.priceDeliveryBase, discount.PERCENT) : this.priceDeliveryBase
         */
    }

    @computed get basketCount() {
        logComputed(this, 'basketCount')
        return this.basket.ITEMS.length
    }

    @computed get basketQuantity() {
        logComputed(this, 'basketQuantity')
        return this.basket.ITEMS.reduce((res, item) => {
            res += item.QUANTITY
            return res
        }, 0)
    }

    @computed get basketItemsForSave() {
        logComputed(this, 'basketItemsForSave')
        return this.basket.ITEMS.map(item => item.getSaveData())
    }

    @computed
    get deliveryOptions() {
        logComputed(this, 'deliveryOptions')
        return this.form.DELIVERIES.map((item) => {
            let res: UiSegmentProps = {
                value: item.ID,
                label: item.ID === 1 ? 'Курьером' : item.NAME,
                icon: item.ID === 1 ? icons.deliveryCourier : icons.deliveryPickup
            }
            if (this.basketNotEmpty) {
                res = {
                    ...res,
                    loading: this.attrValue['DELIVERY_ID'] === item.ID && this.apiMutateReserve.pending,
                }
                if (this.timeModeNearest) {
                    const duration = this.deliveryDurationActual[item.ID as any]
                    if (duration && duration.minutes < 240) {
                        res.badge = ' ~ ' + duration.minutes + ' мин'
                    }
                }
            }
            return res
        })
    }

    @computed get coupon() {
        logComputed(this, 'coupon')
        return this.form.COUPONS?.length ? this.form.COUPONS[0] : null
    }

    @computed get bonusesWithText() {
        return this.bonuses ? this.bonuses + ' ' + plural(this.bonuses, 'бонус', 'бонуса', 'бонусов') : ''
    }

    @computed get bonuses() {
        logComputed(this, 'bonuses')
        return parseInt(this.attrValue['BONUSES'] || '0')
    }

    @computed get bonusesBenefited() {
        logComputed(this, 'bonusesBenefited')
        if (!this.benefitTypeCurrent && this.bonuses || this.benefitTypeCurrent === 'bonus') {
            return this.bonuses
        } else {
            return 0
        }
    }

    @computed get personsNumber() {
        logComputed(this, 'personsNumber')
        return toInt(this.attrValue['PERSONS_NUMBER'], 1)
    }

    @computed get summaryTime() {
        logComputed(this, 'summaryTime')
        return this.attrValue.DATE && this.attrValue.TIME ? this.attrValue.DATE + ' ' + this.attrValue.TIME : 'выбрать время'
    }

    @computed get summaryPickup() {
        logComputed(this, 'summaryPickup')
        return this.pickupDepartmentElement ? this.pickupDepartmentElement.NAME : 'не выбрано'
    }

    @computed get summaryDelivery() {
        if (this.attrValue.ADDRESS) {
            return this.addressFull
        } else {
            return 'выбрать адрес'
        }
    }

    @computed
    get addressFull() {
        return this.getAddress('city')
    }

    @computed
    get addressShort() {
        return this.getAddress(true)
    }

    @computed get summaryCutlery() {
        return this.personsNumber ? this.personsNumber : ''
    }

    @computed get summaryCoupon() {
        return this.coupon ? this.coupon?.COUPON : 'указать'
    }

    @computed get summaryBonuses() {
        return this.bonuses ? 'использовать ' + this.bonuses : 'не используются'
    }

    @computed get summaryPayment() {
        return this.currentPaymentType ? this.currentPaymentType.NAME_SHORT || this.currentPaymentType.NAME : 'выбрать способ оплаты'
    }

    @computed get bonusesAvailable() {
        return this.stores().sale.userClientCard?.BONUSES || 0
    }

    @computed get bonusesMaxPercent() {
        return this.stores().sale.userClientCard?.BONUSES_PERCENT || 0
    }

    @computed get bonusesMax() {
        const bonusesAvailable = this.bonusesAvailable
        const bonusesMaxPercent = this.bonusesMaxPercent
        let max = 0

        if (bonusesAvailable && bonusesMaxPercent) {
            max = Math.round(this.priceTotalBase * bonusesMaxPercent / 100)
            if (max > bonusesAvailable)
                max = bonusesAvailable
        }
        return max
    }

    @computed get couponFilled() {
        return !!this.form.COUPONS?.length
    }

    @computed get pickupDepartmentElement() {
        return this.getCompanyStore().offices.find((office: ElementModel) => office.ID === this.attrValue['PICKUP_DEPARTMENT'])
    }

    @computed
    get deliveryDateTimeStr() {
        if (this.attrValue['DATE'] && this.attrValue['TIME']) {
            return [this.attrValue['DATE'], this.attrValue['TIME']].join(' ')
        }
    }

    @computed
    get deliveryTimeDayjs() {
        if (this.deliveryDateTimeStr)
            return parseTime(this.deliveryDateTimeStr, 'datetime', 'object')
    }

    @computed
    get deliveryTimeTs() {
        if (this.deliveryDateTimeStr)
            return parseTime(this.deliveryDateTimeStr, 'datetime')
    }

    @computed
    get rulesPickup() {
        const res: TValidateRules = []
        res.push(v => !!this.attrValue.PICKUP_DEPARTMENT || 'Не выбрано подразделение самовывоза')
        return res
    }

    @computed
    get rulesDelivery() {
        const res: TValidateRules = []
        res.push(v => !!this.attrValue.ADDRESS || 'Не указан адрес доставки')
        res.push(v => !!this.attrValue.HOUSE || 'Не указан дом')
        return res
    }

    @computed
    get rulesPerson() {
        const res: TValidateRules = []
        res.push(
            v => {
                const phone = String(this.attrValue.PHONE).trim()
                if (!phone)
                    return 'Не указан номер телефона'
                else if (!checkPhone(phone))
                    return 'Неверный формат номера'
                else return true
            }
        )
        return res
    }

    @computed
    get rulesDiscount() {
        const res: TValidateRules = []
        return res
    }

    @computed
    get rulesCoupon() {
        const res: TValidateRules = []
        return res
    }

    @computed
    get rulesTime() {
        const res: TValidateRules = [
            v => !!this.attrValue['DATE'] || !!this.attrValue['TIME'] || 'не выбрана дата и время',
            v => !!this.attrValue['DATE'] || 'не выбрана дата',
            v => !!this.attrValue['TIME'] || 'не выбрано время',
            v => {
                if (this.deliveryRequestReserveActual) {
                    return true
                } else if (typeof this.deliveryRequest.result.success === 'undefined') {
                    return 'Время не проверено'
                } else if (this.deliveryRequest.result.status === 'time_busy') {
                    return 'Время занято'
                } else if (this.deliveryRequest.result.status === 'service_unavailable') {
                    return 'Сервис временно недоступен'
                } else if (this.isDeliveryRequestReserveExpired()) {
                    return 'Нужно проверить время'
                } else {
                    return true
                }
            }
        ]
        return res
    }

    @computed
    get rulesBenefit() {
        const res: TValidateRules = []
        return res
    }

    @computed
    get rulesPayment() {
        const paymentType = this.attrValue['PAYMENT_TYPE']
        const cashSumm = this.attrValue['CASH_SUM']
        const res: TValidateRules = []
        res.push(v => !!paymentType || {type: 'error', message: 'Не указан способ оплаты', ref: 'paymentType'})
        res.push((v, ctx: any) => paymentType !== 'cash' || !!cashSumm || this.openedDialogCode !== 'payment' || {
            type: 'error',
            message: 'Укажите сумму наличных',
            ref: 'paymentCash'
        })
        return res
    }

    @computed
    get rulesCutlery() {
        const res: TValidateRules = []
        res.push(v => !!this.personsNumber || 'Не указано количество приборов')
        return res
    }

    @computed
    get price(): number {
        return this.priceBasket
    }

    @computed
    get currentPaymentType(): OrderAttrOption | undefined {
        const options = this.paymentTypeOptions
        return options.find(item => item.VALUE === this.attrValue.PAYMENT_TYPE)
    }

    @computed
    get currentDelivery(): DeliveryComputed | undefined {
        return this.form.DELIVERIES.find(item => item.ID === this.attrValue.DELIVERY_ID)
    }

    @computed
    get currentDeliveryService(): DeliveryService | undefined {
        return this.currentDelivery?.SERVICE
    }

    @computed
    get transportType(): string | undefined {
        return this.currentDeliveryService?.TRANSPORT_TYPE
    }

    @computed
    get isTransportPickup() {
        return this.transportType === 'pickup'
    }

    @computed
    get isTransportCourier() {
        return this.transportType === 'courier'
    }

    @computed
    get deliveryFieldsEnough() {
        if (this.transportType === 'courier') {
            if (!this.attrValue.ADDRESS || !this.attrValue.HOUSE) {
                return false
            }
            if (this.attrValue.PRIVATE_HOUSE !== 'Y' && !this.attrValue.HOUSE) {
                return false
            }
        } else {
            if (!this.attrValue.PICKUP_DEPARTMENT) {
                return false
            }
        }
        return true
    }

    @computed
    get isSyncProcess() {
        return !!this.syncHandler
    }

    @computed
    get attrsByCode() {
        return this.form.ATTRS.reduce((map: any, item) => {
            if (item.CODE)
                map[item.CODE] = item
            return map
        }, {})
    }

    @computed
    get paymentTypeOptions() {
        const attr = this.attr['PAYMENT_TYPE']
        return attr && attr.OPTIONS ? attr.OPTIONS : []
    }

    @computed
    get deliveryRequestReserveActual() {
        return this.deliveryRequest.result.success && !this.isDeliveryRequestReserveExpired()
    }

    @computed
    get deliveryFields() {
        if (!this.currentDelivery)
            return null
        return {
            TRANSPORT_TYPE: this.transportType,
            DELIVERY_ID: this.attrValue['DELIVERY_ID'],
            PICKUP_DEPARTMENT: this.attrValue['PICKUP_DEPARTMENT'],
            ADDRESS: this.attrValue['ADDRESS'],
            HOUSE: this.attrValue['HOUSE'],
            FLAT: this.attrValue['FLAT'],
            ADDRESS_FULL: this.addressFull,
        }
    }

    @computed
    get deliveryFieldsWithTime() {
        if (!this.currentDelivery)
            return null
        return {
            ...this.deliveryFields,
            DATE: this.attrValue['DATE'] || null,
            TIME: this.attrValue['TIME'] || null,
        }
    }

    @computed
    get deliveryTimeSelectedAndActual() {
        return !!this.deliveryTimeTs
    }

    @computed
    get cashMoneyOptions() {
        return cashMoneyOptions(this.price)
    }

    @computed
    get profile() {
        const profileId = this.profileId
        if (profileId) {
            return this.getSaleStore().userOrderProfiles.find((profile: OrderProfileModel) => profile.ID === profileId)
        }
    }

    @computed
    get benefitType(): TBenefitTypeValue {
        return this.attrValue['BENEFIT_TYPE']
    }

    @computed
    get benefitTypeCurrent(): TBenefitTypeValue {
        if (!this.basketItems.length) return 'discount';
        return this.benefitType
    }

    @computed
    get benefitTypeInfo() {
        return this.benefitTypes.find(item => item.VALUE === this.benefitType)
    }

    @computed
    get benefitTypesAvailableByCode() {
        return this.benefitTypes.reduce<Record<TBenefitTypeValue, TBenefitType>>((map, item) => {
            map[item.VALUE] = item
            return map
        }, {} as any)
    }

    @computed
    get benefitTypes() {

        const res: TBenefitType[] = []

        if (this.discountBest) {
            res.push({
                NAME: 'Скидка ' + this.discountBest.PERCENT + '%',
                NAME_OF: 'Скидку',
                NAME_IN: 'Скидки',
                CAPTION: this.discountBest.PERCENT + '%',
                VALUE_VIEW: this.discountBest.PERCENT + '%',
                VALUE: 'discount',
                ICON: icons.discount,
            })
        }

        if (this.bonusesAvailable) {
            res.push({
                NAME: 'Бонусы',
                NAME_OF: 'Бонусы',
                NAME_IN: 'Бонусов',
                CAPTION: 'до ' + this.bonusesMax,
                VALUE_VIEW: this.bonuses ? 'списать ' + this.bonuses : null,
                VALUE: 'bonus',
                ICON: icons.bonus,
            })
        }

        res.push({
            NAME: 'Промокод',
            NAME_OF: 'Промокод',
            NAME_IN: 'Промокода',
            VALUE_VIEW: this.coupon?.COUPON,
            VALUE: 'coupon',
            ICON: icons.gift,
        })

        return res
    }

    @computed
    get discountBestHash(): string {
        const discount = this.discountBestBenefited
        if (discount) {
            if (discount.CODE)
                return 'CODE-' + discount.CODE.toString()
            else if (discount.ID)
                return 'ID-' + discount.ID.toString()
        }
        return ''
    }

    @computed
    get discountBest(): DiscountItemModel | undefined {
        return this.discountsFilteredSorted[0]
    }

    @computed
    get discountBestBenefited(): DiscountItemModel | undefined {
        return !this.benefitTypeCurrent || this.benefitTypeCurrent === 'discount' ? this.discountBest : undefined
    }

    @computed
    get discountsFilteredSorted() {
        return (this.form.DISCOUNTS || [])
            .filter((discount) => {
                const conditions = [...(discount.CONDITIONS || []), ...(discount.DISCOUNT?.CONDITIONS || [])]
                const res = this.conditionsResult(conditions)
                return res
            })
            .sort((a, b) => {
                return (a.PERCENT || 0) > (b.PERCENT || 0) ? -1 : 1
            })
    }


    // ACTIONS

    @computed
    get updatingForm() {
        return this.apiMutateSubmit.pending
    }

    @computed
    get updatingPrice() {
        return this.apiMutateSubmit.pending
    }

    @computed
    get mutating() {
        return this.apiMutateSubmit.pending || this.apiMutateReserve.pending
    }

    @computed
    get accessOrderForm() {
        return this.stores().user.isAuthorized || this.guestMode
    }

    @computed
    get deliveryDurationByProfileActual() {
        return Object.keys(this.deliveryDurationByProfile).reduce<Record<any, TDeliveryDuration>>((map, profileId) => {
            const info = this.deliveryDurationByProfile[profileId]
            if (info && (Date.now() - info.fetchTime < 1000 * 60 * 15)) {
                map[profileId] = info
            }
            return map
        }, {})
    }

    @computed
    get deliveryDurationActual() {
        return Object.keys(this.deliveryDuration).reduce<Record<any, TDeliveryDuration>>((map, deliveryId) => {
            const info = this.deliveryDuration[deliveryId]
            if (info && (Date.now() - info.fetchTime < 1000 * 60 * 15)) {
                map[deliveryId] = info
            }
            return map
        }, {})
    }

    @computed
    get courierDelivery() {
        return this.form.DELIVERIES.find(item => item.SERVICE?.TRANSPORT_TYPE === 'courier')
    }

    getUpSaleProducts(props: TCatalogUpSaleProps) {
        const products: ProductModel[] = this.stores().catalog.getUpSaleProducts(props)
        return products.filter((product) => {
            return !this.basketItemsByProductId[product.ID]
        })
    }

    deliveryRequestReserveDebounced: ((datetime?: any, props?: TDeliveryReserveProps) => boolean) = () => {
        return true
    }

    deliveryRequestReserveDebouncedFast: ((datetime?: any, props?: TDeliveryReserveProps) => boolean) = () => {
        return true
    }

    getTransportTypeName(rodPadeg?: boolean) {
        if (rodPadeg) {
            return this.isTransportCourier ? 'доставки' : 'самовывоза'
        } else {
            return this.isTransportCourier ? 'доставка' : 'самовывоз'
        }
    }

    isDeliveryRequestReserveExpired() {
        if (this.deliveryRequest.result.timestamp) {
            const age = Date.now() - this.deliveryRequest.result.timestamp
            return age > 1000 * 60 * 10
        } else {
            return true
        }
    }

    getBasketItemCalculated(item: BasketItemModel): TBasketItemCalculated {
        return {
            model: item,
            calc: this.calculateBasketItem(item)
        }
    }

    getRulesBonus() {
        const res: TValidateRules = []
        res.push(v => !v || v <= this.price || 'Стоимость заказа меньше указанного количества бонусов')
        res.push(v => !v || v <= this.bonusesAvailable || 'Количество указанных бонусов больше доступного')
        return res
    }

    @action
    async onAfterOrderSubmit() {
        this.stores().sale.fetchOrdersActive.polling()
        await this.newVorder()
    }

    @action
    async newVorder() {
        this.basket.ITEMS = []
        this.basketItemByProductId = {}
        this.setFieldValue('USER_DESCRIPTION', '')
        this.couponsClear()
        this.setPropValues({
            DATE: null,
            TIME: null,
            BONUSES: 0,
        })

        Object.assign(this.deliveryRequest.result, this.deliveryRequest.resultDefault)

        this.resetDeliveryRelated()

        await this.apiReload({})

        this.checkDeliveryRelated()
        this.ensureProfile()

        runInAction(() => {
            this.vorderWasOpened = false
        })
    }

    @action
    deliveryTabChange(deliveryId: number) {
        this.setFieldValue('DELIVERY_ID', deliveryId)
        if (this.timeModeNearest) {
            /*
            this.setPropValues({
                DATA: null,
                TIME: null
            })

             */
        }
        this.deliveryRequestReserveDebounced()
    }

    @action
    pickupDepartmentChange(departmentId: number, validate: boolean = true) {
        this.setPropValue('PICKUP_DEPARTMENT', departmentId)
        validate && this.vorderValidate('pickup')
    }

    @action
    async deliveryRequestReserve(forProfileId?: number | null, props: TDeliveryReserveProps = {}) {

        const debug = false


        const profileId = forProfileId || this.profileId

        if (this.apiMutateReserve.pending) {
            this.needReserveAgainProfile = profileId
            return null
        }

        this.needReserveAgainProfile = 0

        if (!this.deliveryFieldsEnough) {
            console.log(false, 'ERROR! deliveryFieldsEnough')
            return
        }

        const isCourier = this.isTransportCourier
        const deliveryId = this.attrValue['DELIVERY_ID']
        const timeMode = this.attrValue['TIME_MODE']
        const timeModeNearest = timeMode === 'nearest'

        let deliveryFields: any = {
            ...this.deliveryFieldsWithTime
        }

        let datetime: any

        if (!datetime) {
            if (timeModeNearest) {
                datetime = Date.now()
            } else {
                if (this.deliveryTimeTs) {
                    datetime = this.deliveryTimeTs
                } else {
                    datetime = Date.now()
                    runInAction(() => {
                        this.setPropValue('DATE', dayjs(datetime).format('DD.MM.YYYY'))
                        this.setPropValue('TIME', dayjs(datetime).format('HH:mm'))
                    })
                }
            }
        }

        const body: MutationSalePubVorderReserveArgs = {
            time: Math.round(datetime / 1000),
            timeMode: timeMode,
            timeSave: true,
            profileId
        }

        const bodyExt = {
            ...body,
            datetime: datetime,
            datetimeFormat: timestampToFormat(datetime, 'datetime'),
        }

        Object.assign(this.deliveryRequest.result, this.deliveryRequest.resultDefault)

        try {
            console.log('DELIVERY RESERVE', bodyExt)

            const res = await this.apiMutateReserve(body)

            return runInAction(() => {

                if (!res || !res.state || !res.payload)
                    return;

                if (timeModeNearest) {
                    delete this.deliveryDuration[deliveryId]
                    delete this.deliveryDurationByProfile[profileId]
                }

                console.log('DELIVERY RESERVE - RESOLVED', res.state.success)

                debug && console.log({
                    status: res.state.status,
                    success: res.state.success,
                    timeAvailable: res.payload.timeAvailable,
                    departmentId: res.payload.departmentId,
                    departmentName: res.payload.departmentName,
                    departmentServiceId: res.payload.departmentServiceId,
                    departmentServiceName: res.payload.departmentServiceName,
                    deliveryPrice: res.payload.deliveryPrice,
                    deliveryFreeFromPrice: res.payload.deliveryFreeFromPrice
                }, 'deliveryRequestReserve - DONE')

                const now = Date.now()
                const nowUnix = Math.round(now / 1000)

                Object.assign(this.deliveryRequest.result, {
                    status: res.state.status,
                    success: res.state.success,
                    timeAvailable: res.payload.timeAvailable,
                    departmentId: res.payload.departmentId,
                    departmentName: res.payload.departmentName,
                    departmentServiceId: res.payload.departmentServiceId,
                    departmentServiceName: res.payload.departmentServiceName,
                    deliveryPrice: res.payload.deliveryPrice,
                    deliveryFreeFromPrice: res.payload.deliveryFreeFromPrice
                })

                if (res.state.success) {

                    this.deliveryRequest.result.timestamp = now

                    let foundDate, foundTime

                    if (timeMode === 'nearest') {
                        datetime = parseTime(res.payload.timeAvailable, null)
                        foundDate = timestampToFormat(datetime, 'DD.MM.YYYY')
                        foundTime = timestampToFormat(datetime, 'HH:mm')
                    } else {
                        foundDate = timestampToFormat(datetime, 'DD.MM.YYYY')
                        foundTime = timestampToFormat(datetime, 'HH:mm')
                    }

                    deliveryFields.DATE = foundDate
                    deliveryFields.TIME = foundTime

                    this.setPropValue('DATE', foundDate, true)
                    this.setPropValue('TIME', foundTime, true)

                    if (timeModeNearest) {
                        this.setDeliveryDurationTime(res.payload.timeAvailable, profileId)
                    }
                }

                if (res.state.status && res.state.status !== 'service_unavailable') {

                    if (isCourier) {
                        let freeFromPrice = toInt(res.payload.deliveryFreeFromPrice, 0)
                        if (freeFromPrice) {
                            this.setPropValue('DELIVERY_FREE_FROM_PRICE', freeFromPrice)
                            this.setPropValue('DELIVERY_FREE_UPDATED_TIME', Math.round(Date.now() / 1000))
                            if (profileId) {
                                const profile = this.stores().sale.getProfileById(profileId)
                                if (profile) {
                                    profile.updateDeliveryFreeFromPrice(freeFromPrice)
                                }
                            }
                        }
                        if (!this.attrValue['DELIVERY_FREE_FROM_PRICE']) {
                            this.setPropValue('DELIVERY_FREE_FROM_PRICE', SaleConfig.SALE_DELIVERY_FREE_FROM_PRICE)
                        }
                    }

                    this.setPropValue('RESERVE_SUCCESS_REQUEST_TIME', nowUnix)

                    res.payload.departmentId && this.setPropValue('DELIVERY_DEPARTMENT', res.payload.departmentId)
                }

                this.vorderValidate('time')

                if (res.state.success) {
                    //onSuccess && onSuccess(res)
                }

                if (this.needReserveAgainProfile) {
                    this.deliveryRequestReserve(this.needReserveAgainProfile)
                }

                return res.state.success
            })

        } catch (e) {
            console.log(e, 'CATCH')
            return false
        }
    }

    @action
    SCOPE_APP(data: any) {

    }

    @action
    SCOPE_SESSION(data: TGqlScopeVorderSession) {

        if (data.basketProducts)
            this.stores().catalog.fillProducts(data.basketProducts)

        if (data.vorder)
            this.setVorder(data.vorder)
    }

    @action
    setup() {
        this.resetDeliveryRelated()
        this.ensureProfile()
        this.checkDeliveryRelated()
    }

    @action
    checkDeliveryRelated() {
        this.setBenefitType(this.checkBenefitType())
    }

    @action
    resetDeliveryRelated() {
        this.deliveryDuration = {}
        this.deliveryDurationByProfile = {}
        this.deliveryRequest.resultDefault.deliveryFreeFromPrice = SaleConfig.SALE_DELIVERY_FREE_FROM_PRICE
        this.deliveryRequest.result.deliveryFreeFromPrice = SaleConfig.SALE_DELIVERY_FREE_FROM_PRICE
    }

    @action
    ensureProfile() {
        let profile: TMaybe<OrderProfileModel> = null

        if (this.profileId)
            profile = this.stores().sale.userOrderProfiles.find((item: OrderProfileModel) => item.ID === this.profileId)

        if (!profile)
            profile = this.stores().sale.getUserDefaultProfile()

        if (profile)
            this.setProfile(profile)
    }

    // METHODS

    @action
    setAttrValue(type: string, code: string, value: any, skipProcessor: boolean = false) {

        let attr = this.form.ATTRS.find(item => item.CODE === code && item.ATTR_TYPE === type)

        if (!attr) {
            attr = {
                ATTR_TYPE: type,
                CODE: code,
                VALUE: value
            }
            this.form.ATTRS.push(attr)
            this.attr[code] = attr
        }

        attr.VALUE = value

        this.attrValue[code] = value

        if (!skipProcessor) {
            switch (code) {
                case 'TIME':
                case 'DATE':
                    //this.deliveryReserveReset()
                    break
            }
        }
    }

    @action
    setPropValue(code: string, value: any, skipProcessor: boolean = false) {
        this.setAttrValue('prop', code, value, skipProcessor)
    }

    @action
    setFieldValue(code: string, value: any, skipProcessor: boolean = false) {
        this.setAttrValue('field', code, value, skipProcessor)
    }

    @action
    async init() {
        this.indexAttrs(this.form.ATTRS)
        this.disposers = classComputedPropsCache(this, [], [
            'specialOffersFiltered',
            'deliveryRequestReserveActual'
        ])
        autorun(reaction => {
            if (this.basketNotEmpty) {
                const benefitTypeNew = this.checkBenefitType(this.benefitType)
                if (benefitTypeNew !== this.benefitType) {
                    this.setBenefitType(benefitTypeNew)
                }
            }
        })
        // @ts-ignore
        this.deliveryRequestReserveDebounced = debounce(this.deliveryRequestReserve, 3000)
        // @ts-ignore
        this.deliveryRequestReserveDebouncedFast = debounce(this.deliveryRequestReserve, 500)
    }

    @action
    setPropValues(props: object) {
        for (const [code, value] of Object.entries(props)) {
            this.setPropValue(code, value)
        }
    }

    @action
    setProfile(profile: OrderProfileModel) {

        this.stores().debug.info('vorder.setProfile', {
            id: profile.ID,
            getAddressForView: profile.getAddressForView()
        }, {scope: 'store'})

        this.setPropValue('PROFILE_ID', profile.ID)
        this.setPropValues(profile.getVorderProps())
        if (this.isTransportCourier) {
            const courierDelivery = this.courierDelivery
            if (courierDelivery) {
                this.deliveryDuration[courierDelivery.ID] = this.deliveryDurationByProfileActual[profile.ID]
            }
        }
    }

    @action
    deliveryRecalculateAfterProfileUpdate() {
        console.log('deliveryRecalculateAfterProfileUpdate')
        this.deliveryRequestReserve()
    }

    @action
    deliveryRecalculateAfterDepartmentUpdate() {
        console.log('deliveryRecalculateAfterDepartmentUpdate')
        this.deliveryRequestReserve()
    }

    @action
    couponsClear() {
        this.form.COUPONS = []
    }

    @action
    sync(timeout?: number) {

        return;

        /*
        const cb = async () => {
            await this.apiMutateSync({})
            runInAction(() => {
                this.syncHandler = null
            })
        }

        runInAction(() => {
            timeout = timeout || this.syncTimeout
            clearTimeout(this.syncHandler)
            this.syncHandler = setTimeout(cb, timeout)
        })

         */
    }

    @action
    setVorder(data: Vorder) {

        this.vorderId = data.ID || 0

        if (data.BASKET)
            this.setBasket(data.BASKET)

        if (data.FORM) {
            Object.assign(this.form, {
                ...data.FORM,
                DISCOUNTS: data.FORM.DISCOUNTS ? data.FORM.DISCOUNTS.map(item => new DiscountItemModel(item)) : [],
                SPECIAL_OFFERS: data.FORM.SPECIAL_OFFERS ? data.FORM.SPECIAL_OFFERS.map(item => new SpecialOfferModel(item)) : []
            })
            this.indexAttrs(this.form.ATTRS)
        }

        if (data.ORDER)
            Object.assign(this.order, data.ORDER)

        this.synced = true
    }

    @action
    vorderValidateAll() {

        const errors: TValidateErrors = []

        this.vorderValidate('person', errors)

        if (this.isTransportCourier) {
            this.vorderValidate('delivery', errors)
        } else {
            this.vorderValidate('pickup', errors)
        }

        this.vorderValidate('time', errors)
        this.vorderValidate('payment', errors)
        this.vorderValidate('benefit', errors)

        return !errors.length
    }

    @action
    validateReset(name: keyof VorderValidateResults) {
        this.validateResult[name] = null
    }

    @action
    vorderValidate(
        name: keyof VorderValidateResults,
        errorsCollector?: TValidateErrors | null,
        ctx: TVorderVaidateContext = {} = {}
    ) {
        switch (name) {
            case "person":
                this.validateResult.person = testRules('first', this.rulesPerson, null, errorsCollector, ctx)
                return this.validateResult.person
            case "delivery":
                this.validateResult.delivery = testRules('first', this.rulesDelivery, null, errorsCollector, ctx)
                return this.validateResult.delivery
            case "pickup":
                this.validateResult.pickup = testRules('first', this.rulesPickup, null, errorsCollector, ctx)
                return this.validateResult.pickup

            case "time":
                this.validateResult.time = testRules('first', this.rulesTime, null, errorsCollector, ctx)
                return this.validateResult.time
            case "payment":
                this.validateResult.payment = testRules('first', this.rulesPayment, null, errorsCollector, ctx)
                return this.validateResult.payment
            case "benefit":
                this.validateResult.benefit = testRules('first', this.rulesBenefit, null, errorsCollector, ctx)
                return this.validateResult.benefit
        }
    }

    @action
    async vorderDialogOpen(
        name: keyof VorderDialogs,
        props: VorderBenefitDialogProps
            | VorderPickupDialogProps
            | VorderSectionDialogProps
            = {}
    ) {
        const dialog = this.dialogs[name]
        if (dialog) {
            dialog.show(props as any)
            this.openedDialogCode = name
        }
    }

    @action
    async vorderDialogClose(name: keyof VorderDialogs) {
        const dialog = this.dialogs[name]
        if (dialog) {
            this.vorderValidate(name)
            this.dialogs[name].hide()
            this.openedDialogCode = null
        }
    }

    conditionsResult(conditions: DiscountCondition[]) {
        const testCondition = (condition: DiscountCondition) => {
            switch (condition.TYPE) {
                case 'transport_type':
                    if (condition.VALUE === 'courier') {
                        return this.isTransportCourier
                    } else if (condition.VALUE === 'pickup') {
                        return this.isTransportPickup
                    }
                    break;
            }
            return true
        }
        for (const condition of conditions) {
            if (!testCondition(condition)) {
                return false
            }
        }
        return true
    }

    calculateProduct(product: ProductModel): TProductCalculation {
        let priceBase = product.PRICE?.PRICE || 0
        let price = priceBase
        let discountPercent = 0
        const discount = this.discountBestBenefited
        if (discount) {
            if (discount.PERCENT) {
                discountPercent += discount.PERCENT
            }
            /*
            console.log({
                productName: product.NAME,
                productPrice: price,
                productPriceDiscounted: price - (price / 100) * discountPercent,
                discountPercent: discountPercent,
            })

             */
        }
        return {
            discountPercent: discountPercent,
            priceDiscounted: this.applyPricePercent(price, discountPercent),
            priceBase: priceBase
        }
    }

    applyPricePercent(price: number, percent: number) {
        return percent ? (price - (price / 100) * percent) : price
    }

    getSaleStore() {
        const stores = require('~stores').default
        return stores.sale
    }

    getCompanyStore() {
        const stores = require('~stores').default
        return stores.company
    }

    getBasketStore() {
        const stores = require('~stores').default
        return stores.basket
    }

    @action
    setCustomTime(time: any) {
        const reserveRequestTime = Date.now()
        const reserveRequestTimeUnix = Math.round(reserveRequestTime / 1000)

        this.setPropValue('DATE', timestampToFormat(time, 'DD.MM.YYYY'), true)
        this.setPropValue('TIME', timestampToFormat(time, 'HH:mm'), true)
        this.setPropValue('RESERVE_SUCCESS_REQUEST_TIME', reserveRequestTimeUnix, true)

        this.deliveryRequest.result.success = true
        this.deliveryRequest.result.status = 'success'
        this.deliveryRequest.result.timestamp = reserveRequestTime

        this.validateResult.time = null

        //this.setDeliveryDurationTime(time)
    }

    @action
    setDeliveryDurationTime(time: any, profileId?: number) {
        console.log('setDeliveryDurationTime')
        const toTime = parseTime(time, null, 'dayjs') as dayjs.Dayjs
        if (!toTime || !toTime.isValid())
            return
        const minutes = toTime.diff(dayjs(), 'minute')

        if (minutes > 10) {
            this.deliveryDuration[this.attrValue['DELIVERY_ID']] = {
                fetchTime: Date.now(),
                minutes
            }

            console.log('set', {
                deliveryId: this.attrValue['DELIVERY_ID'],
                fetchTime: Date.now(),
                minutes
            })

            if (profileId)
                this.deliveryDurationByProfile[profileId] = {
                    fetchTime: Date.now(),
                    minutes
                }
        }
    }

    @action
    deliveryReserveReset() {
        this.deliveryRequest.result.success = undefined
        this.deliveryRequest.result.status = undefined
        this.deliveryRequest.result.timestamp = 0
    }

    @action
    async wokSetBasket(basket: any) {
        this.wokBasket = basket
    }

    @action
    showBasketModal() {
        this.basketModal.visible = true
        this.basketSetTimeout(1000)
        if (!this.basketSynced) {
            this.basketSync()
        }
    }

    // TASKS

    @action
    hideBasketModal() {
        this.basketModal.visible = false
        this.basketSetTimeout('default')
    }

    @action
    navLogin() {
        this.hideBasketModal()
        setTimeout(() => {
            this.stores().user.navLogin({
                onReady: () => {
                    //this.navBasket()
                },
            })
        }, 700)
    }

    @action
    basketSetTimeout(timeout: number | 'default') {
        this.basketSyncTimeout = timeout === 'default' ? BASKET_TIMEOUT_DEFAULT : timeout
    }


    //@task
    //apiMutateBasket = ((options) => mutateBasket(this, options)) as Task<undefined, VOrderBasket>

    @action
    basketSetQuantity(data: TBasketOpSetQuantity) {
        this.basketSynced = false
        const basketItem = this.findBasketItem(data)

        if (basketItem) {
            if (data.quantity > 0) {
                basketItem.QUANTITY = data.quantity
            } else {
                delete this.basketItemByProductId[basketItem.PRODUCT_ID]
                this.basket.ITEMS = this.basket.ITEMS.filter(item => item !== basketItem)
            }
        }

        busService.emitter.emit('basket.updated')
    }

    @action
    basketDelete(data: TBasketOpDelete) {
        this.basketSynced = false
        const basketItem = this.findBasketItem(data)

        if (basketItem) {
            delete this.basketItemByProductId[basketItem.PRODUCT_ID]
            this.basket.ITEMS = this.basket.ITEMS.filter(item => item !== basketItem)
        }
        busService.emitter.emit('basket.updated')
    }

    @action
    setBasket(data: Basket, preserveItems = false) {

        Object.assign(this.basket, {
            ...data,
            ITEMS: this.basket.ITEMS,
        })

        if (!preserveItems) {
            this.basket.ITEMS = this.basketItemsToModels(data.ITEMS || [])
            this.indexItems()
        } else {
            const newItems = this.basketItemsToModels(data.ITEMS || [])
            const oldItems = this.basket.ITEMS
            oldItems.forEach(oldItem => {
                newItems.forEach(newItem => {
                    if (oldItem.ID === newItem.ID || oldItem.CLIENT_ID === newItem.CLIENT_ID) {
                        oldItem.ID = newItem.ID
                        oldItem.PROPS = newItem.PROPS
                        oldItem.indexProps()
                    }
                })
            })
        }

        this.basketSynced = true
    }


    // UTILS

    @action
    setOrder(data: Order) {
        Object.assign(this.order, data)
    }

    @action
    setForm(data: VorderForm) {
        Object.assign(this.form, data)
        this.indexAttrs(this.form.ATTRS)
    }

    @action
    async clear() {
        this.basketSynced = false
        this.basket.ITEMS = []
        this.basketItemByProductId = {}
        busService.emitter.emit('basket.updated')
    }

    @action
    indexItems() {
        this.basket.ITEMS.forEach(item => {
            this.basketItemByProductId[item.PRODUCT_ID] = item
        })
    }

    getSelf() {
        return this
    }

    @action
    removeOfferBasketItems() {

        const itemsToRemove = this.basketItems.filter(item => {
            const product = item.product
            if (product && product.REQUIRED_MIN_PRICE && (this.priceBasketWithoutSpecial < product.REQUIRED_MIN_PRICE)) {
                return true
            }
            return false
        })

        if (itemsToRemove.length) {
            this.basket.ITEMS = this.basket.ITEMS.filter((item) => {
                if (itemsToRemove.includes(item)) {
                    busService.showAlert({
                        type: 'error',
                        message: item.name + ' удален, т.к. сумма заказа меньше необходимой'
                    })
                    delete this.basketItemByProductId[item.PRODUCT_ID]
                    return false
                }
                return true
            })
        }
    }

    @action
    onVorderDialogOpened(tab: 'basket' | 'order') {
        if (!this.vorderWasOpened) {
            this.vorderWasOpened = true
            this.refreshReserveIfNeed(true)
        } else {
            this.refreshReserveIfNeed()
        }
    }

    @action
    refreshReserveIfNeed(force: boolean = false) {
        const priceChanged = Math.abs(this.lastTriggerPrice - this.priceBasketBase) > 1500
        if (force || priceChanged) {
            this.lastTriggerPrice = this.priceBasketBase
            this.deliveryRequestReserveDebounced()
        }
    }

    @action
    onBasketChange() {

        if (!this.basketModal.visible) {
            const freePrice = this.deliveryFreeFromPrice
            const basketPrice = this.priceBasket
            const untilFreePrice = freePrice - basketPrice

            if (untilFreePrice > 0) {
                this.prevDeliveryIsPaid = true
                const progress = 100 * basketPrice / freePrice
                this.bus().showAlert({
                    type: 'info',
                    content: <View gap-7>
                        <Text text-md white>
                            До бесплатной доставки{SPACE}
                            <Text
                                text-md-bo
                                white
                            >
                                {this.services().catalogUtil.price(untilFreePrice)}
                            </Text>
                        </Text>
                        <ProgressBar fullWidth={true} progress={progress} progressColor={COLORS.primary}/>
                    </View>,
                    duration: 3000
                })
            } else {
                if (this.prevDeliveryIsPaid) {
                    this.prevDeliveryIsPaid = false
                    this.bus().showAlert({
                        type: 'info',
                        message: 'Вы набрали сумму для бесплатной доставки',
                    })
                } else {
                    busService.hideToasts()
                }
            }
        }
    }

    @action
    basketOp(data: TBasketOpAdd | TBasketOpAddConstructor | TBasketOpSetQuantity | TBasketOpDelete | TBasketOpClear): BasketItemModel | undefined {

        this.basketSynced = false

        let basketItem: BasketItemModel | undefined

        switch (data.action) {
            case "add": {
                basketItem = this.findBasketItem(data)
                if (!basketItem) {
                    const propsData = data.props || {}
                    const props = Object.keys(propsData).reduce<BasketItemProp[]>((map, propCode) => {
                        const prop = propsData[propCode]
                        if (prop) {
                            map.push({
                                CODE: propCode,
                                XML_ID: propCode,
                                ...prop
                            })
                        }
                        return map
                    }, [])
                    basketItem = new BasketItemModel({
                        ID: 0,
                        CLIENT_ID: randID(),
                        PRODUCT_ID: data.productId,
                        QUANTITY: data.quantity,
                        ELEMENT: data.product as any,
                        INPUT_PROPS: data.inputProps || {},
                        PROPS: props,
                        INPUT_PROPS_HASH: '',
                    }, true)

                    this.basket.ITEMS.push(basketItem)
                    this.basketItemByProductId[basketItem.PRODUCT_ID] = basketItem
                } else {
                    basketItem.QUANTITY++
                }
                this.onBasketChange()
                break
            }
            case "quantity": {
                const basketItem = this.findBasketItem(data)
                if (basketItem) {
                    if (data.quantity > 0) {
                        basketItem.QUANTITY = data.quantity
                    } else {
                        this.basket.ITEMS = this.basket.ITEMS.filter(item => item !== basketItem)
                        delete this.basketItemByProductId[basketItem.PRODUCT_ID]
                    }
                    this.removeOfferBasketItems()
                    this.onBasketChange()
                }
                break;
            }
            case "delete": {
                basketItem = this.findBasketItem(data)
                if (basketItem) {
                    this.basket.ITEMS = this.basket.ITEMS.filter(item => item !== basketItem)
                    delete this.basketItemByProductId[basketItem.PRODUCT_ID]
                    this.removeOfferBasketItems()
                    this.onBasketChange()
                }
                break;
            }
            case "clear": {
                this.basket.ITEMS = []
                this.basketItemByProductId = {}
                break;
            }
        }

        //debounceOperation('vorder.basket', 2000, this.apiMutateBasket)
        busService.emitter.emit('basket.updated')
        return basketItem
    }

    getTest() {
        return '--MMMM--'
    }

    getPayload(): VorderInput {
        return {
            attrs: this.getPayloadAttrs(),
            basket: this.getPayloadBasket(),
        }
    }

    getPayloadBasket() {
        return this.basket.ITEMS.map((item) => ({
            ID: item.ID,
            CLIENT_ID: item.CLIENT_ID,
            PRODUCT_ID: item.PRODUCT_ID,
            NAME: item.NAME,
            QUANTITY: item.QUANTITY,
            INPUT_PROPS: item.INPUT_PROPS
        }))
    }

    getPayloadAttrs() {
        return this.form.ATTRS
    }

    getOrderPayload() {
        return {
            attrs: this.form.ATTRS,
            basket: this.basket.ITEMS,
        }
    }

    getBasketItemQuantity(data: {
        basketId?: number,
        productId?: number,
        productHash?: string,
        product?: ProductModel
    }) {
        const item = this.findBasketItem(data)
        return item ? item.QUANTITY : 0
    }

    getInputPropsHash(props: any) {
        return JSON.stringify(props)
    }

    onBasketUpdated() {
        this.basketSync()
    }

    basketSync(timeout?: number) {
        timeout = timeout || this.basketSyncTimeout
        clearTimeout(this.basketSyncHandler)
        this.basketSyncCurrentTimeout = timeout
        this.basketSyncHandler = setTimeout(() => {
            //this.apiMutateBasket()
        }, timeout)
    }

    findBasketItem(data: {
        basketId?: number,
        productId?: number,
        productHash?: string,
        product?: ProductModel,
        props?: any
    }) {
        const basketPropsHash = getBasketPropsHash(data.props)
        return this.basket.ITEMS.find(item => {
                if (data.basketId) {
                    return data.basketId === item.ID
                } else if (data.productId) {
                    return data.productId === item.PRODUCT_ID && (!basketPropsHash || item.INPUT_PROPS_HASH === basketPropsHash)
                } else if (data.product) {
                    return data.product.ID === item.PRODUCT_ID && (!basketPropsHash || item.INPUT_PROPS_HASH === basketPropsHash)
                }
            }
        )
    }

    getAttrsForRequest() {
        return this.form.ATTRS
    }

    basketItemsToModels(items: BasketItem[]): BasketItemModel[] {
        return items.map((item: any) => new BasketItemModel(item))
    }

    checkBenefitType(type?: TBenefitTypeValue | null): TBenefitTypeValue | null | undefined {

        let _type = type

        switch (type) {
            case "discount":
                if (!this.discountBest) {
                    _type = null
                }
                break;
            case "bonus":
                if (!this.bonuses) {
                    _type = null
                }
                break;
            case "coupon":
                if (!this.couponFilled) {
                    _type = null
                }
                break;
        }

        if (!_type) {
            if (this.couponFilled && this.benefitTypesAvailableByCode.coupon) {
                _type = 'coupon'
            } else if (this.bonuses && this.benefitTypesAvailableByCode.bonus) {
                _type = 'bonus'
            } else if (this.discountBest) {
                _type = 'discount'
            }
        }
        return _type
    }

    setBenefitType(type?: TBenefitTypeValue | null) {
        this.setPropValue('BENEFIT_TYPE', type, true)
    }

    @action
    basketAddOrder(order: OrderModel) {
        for (const basketItem of order.BASKET) {
            this.basketOp({
                action: 'add',
                productId: basketItem.PRODUCT_ID,
                quantity: 1,
                product: basketItem.product,
                inputProps: {
                    GIFT: null,
                },
                props: {
                    //GIFT: null,
                },
            })
        }
    }

    calculateBasketItem(item: BasketItemModel): TBasketItemCalculation {
        let discountPercent = 0
        const discount = this.discountBestBenefited
        if (discount) {
            if (discount.PERCENT) {
                discountPercent += discount.PERCENT
            }
        }
        return {
            discountPercent: discountPercent,
            priceTotalDiscounted: this.applyPricePercent(item.finalPriceBase, discountPercent),
            priceDiscounted: this.applyPricePercent(item.priceBase, discountPercent),
        }
    }

    @action
    setCultery(num: string | number) {
        const _num = toInt(num)
        if (_num < 50 && _num >= 1)
            this.setPropValue('PERSONS_NUMBER', _num)
    }

    @action
    setCulteryInc() {
        if (this.personsNumber < 50)
            this.setPropValue('PERSONS_NUMBER', this.personsNumber + 1)
    }

    @action
    setCulteryDec() {
        if (this.personsNumber >= 2)
            this.setPropValue('PERSONS_NUMBER', this.personsNumber - 1)
    }

    navBasket() {
        this.stores().router.push('/sale/basket')
        setTimeout(() => {
            this.showBasketModal()
        }, 50)
    }

    @action
    setGuestMode(guestMode: boolean) {
        this.guestMode = guestMode
    }

    @action
    basketCloseReasonReset() {
        this.basketCloseReason = null
    }

    @action
    basketCloseAndRedirect(routePath: any) {
        this.basketCloseReason = 'redirect'
        this.hideBasketModal()
        setTimeout(() => {
            this.stores().router.replace(routePath)
        }, 500)
    }
}

export default VorderStore

import {action, computed, makeObservable, observable, runInAction} from "mobx"
import {TFetchableOptions} from "@core/main/types"
import {OrderProfileModel} from "@core/sale/model/OrderProfile"
import {graphqlService} from "@core/main/service/graphql"
import {SaleClientCardModel} from "@core/sale/model/ClientCard"
import {OrderModel} from "@core/sale/model/Order"

import {task} from "../../main/lib/decorator/task"
import {
    BonusLevelElement,
    ClientEmit,
    Order,
    OrderProfile,
    OrderStatus,
    QuerySalePubClientCardFetchArgs,
    ServiceOrder
} from "~gql/api";
import {TActionSale, TGqlScopeSaleApp, TGqlScopeSaleSession, TGqlScopeSaleUser} from "@core/sale/types";
import {GeoCoordinates} from "@core/geo/class/GeoCoordinates";
import {DeliveryZoneModel} from "@core/sale/model/DeliveryZone";
import CommonStore from "@core/main/lib/store/common";
import {classComputedPropsCache} from "@core/main/lib/mobx/class-computed-props-cache";
import {busService} from "@core/main/service/bus";
import {logComputed} from "@core/main/lib/mobx/log-computed";
import QUERY_CLIENT_CARD, {TQueryClientCardTask} from "@core/sale/gql/query/client_card"
import MUTATE_PROFILE_DEFAULT from "@core/sale/gql/mutation/profile_default";

import {NoticeModel} from "@core/notice/model/Notice";
import toInt from "@core/main/util/base/toInt";

export class SaleStore extends CommonStore {

    orderStatuses: OrderStatus[] = []
    deliveryZones: DeliveryZoneModel[] = []
    bonusLevels: BonusLevelElement[] = []

    @observable
    userOrderProfilesVersion: number = 0

    @observable
    userOrdersActive: OrderModel[] = []

    @observable
    userOrdersHistory: OrderModel[] = []

    @observable
    userOrderProfiles: OrderProfileModel[] = []

    @observable
    userClientCard?: SaleClientCardModel

    @observable
    addressScreenProfile?: OrderProfileModel

    @observable
    addressScreenSkiped: boolean = false

    @observable
    viewedGiftIds: Record<number, number> = {}

    constructor() {
        super()
        makeObservable(this)
    }

    boot() {
        this.stores().menu.registerActionChannel('sale', this.runAction.bind(this))
    }

    init() {
        this.disposers = classComputedPropsCache(this, [], [
            'orderStatusesComputed'
        ])

        this.bus().on('notice:event:orderStatusUpdate', this.onNoticeEventOrderStatusUpdate.bind(this))

        this.bus().on('socket:emit:orderStatusUpdate', this.onSocketEventOrderStatusUpdate.bind(this))
        this.bus().on('socket:emit:orderUpdatePartial', this.onSocketEventOrderUpdatePartial.bind(this))
        this.bus().on('socket:emit:orderUpdate', this.onSocketEventOrderUpdate.bind(this))

        if (this.userOrdersActive.length) {
            this.fetchOrdersActive.polling()
        }
    }

    @action
    onNoticeEventOrderStatusUpdate(notice: NoticeModel) {
        //this.fetchOrdersActive()
    }

    @action
    onSocketEventOrderStatusUpdate(event: ClientEmit) {
        const {eventData} = event
        if (eventData.orderPartial) {
            const order = this.userOrdersActive.find(item => item.ID === eventData.orderId)
            if (order) {
                order.fill(eventData.orderPartial)
            }
        }
    }

    @action
    onSocketEventOrderUpdate(event: ClientEmit) {
        const {eventData} = event
        if (eventData.order)
            this.mergeActiveOrder(eventData.order)
    }

    @action
    onSocketEventOrderUpdatePartial(event: ClientEmit) {
        const {eventData} = event
        if (eventData.orderPartial) {
            const order = this.userOrdersActive.find(item => item.ID === eventData.orderId)
            if (order) {
                order.fill(eventData.orderPartial)
            }
        }
    }

    showUserGifts() {
        const giftIds = this.userClientCard?.GIFTS || []
        this.stores().debug.info('showUserGifts', {IDS: giftIds}, {scope: 'boot'})
        if (giftIds.length) {
            return () => this.stores().giftsDialog.show()
        }
    }

    orderProfilesToModels(items: OrderProfile[]) {
        return items.map((item) => new OrderProfileModel(item))
    }

    getDeliveryZonesCenter() {
        return new GeoCoordinates([104.28886658428898, 52.28264234172543])
    }

    ensureHaveAddress(loginRedirect: boolean = false) {
        if (!this.userOrderProfiles.length) {
            if (!this.stores().user.isAuthorized && loginRedirect) {
                busService.emitter.emit('bus:router.push', '/login')
            } else {
                busService.emitter.emit('bus:router.push', '/sale/address')
            }
        } else {
            return this.userOrderProfiles[0]
        }
    }

    @action
    SCOPE_APP(data: TGqlScopeSaleApp) {
        if (data.deliveryZones)
            this.deliveryZones = data.deliveryZones.map((item) => new DeliveryZoneModel(item))
        if (data.orderStatuses)
            this.orderStatuses = data.orderStatuses
        if (data.bonusLevels)
            this.bonusLevels = data.bonusLevels
    }

    @action
    SCOPE_SESSION(data: TGqlScopeSaleSession) {
        if (data.profiles)
            this.userOrderProfiles = this.orderProfilesToModels(data.profiles)

        if (data.ordersActive)
            this.userOrdersActive = data.ordersActive.map((item: Order) => new OrderModel(item))
    }

    @action
    SCOPE_USER(data: TGqlScopeSaleUser) {

        if (data.clientCard)
            this.userClientCard = new SaleClientCardModel(data.clientCard)
    }

    @action
    setOrdersHistory(ordersData: ServiceOrder[]) {
        ordersData.forEach((item) => {
            const order = new OrderModel(item as Order, false)
            const index = this.userOrdersHistory.findIndex(item => item.ID == order.ID)
            if (index === -1) {
                this.userOrdersHistory.push(order)
            } else {
                this.userOrdersHistory[index] = order
            }
        })
    }

    @action
    setOrdersActive(ordersData: Order[]) {
        this.userOrdersActive = ordersData.map((item: Order) => new OrderModel(item))
    }

    @action
    async fetchOrderProfiles() {
        try {
            const {data: {res}}: any = await graphqlService.query({
                query: require('@core/sale/gql/query/profile_list').default,
                fetchPolicy: 'no-cache'
            })
            const items = this.orderProfilesToModels(res)

            console.log('fetchOrderProfiles items', items.length)

            runInAction(() => {
                this.userOrderProfiles = items
            })
            return items
        } catch (e) {
            console.log(e)
            return []
        }
    }

    fetchOrdersActive = task(async ({cache}: TFetchableOptions = {}) => {
        this.stores().debug.info('fetchOrdersActive', {}, {scope: 'store'})
        try {
            const {data: {res}}: any = await graphqlService.query({
                query: require('@core/sale/gql/query/orders_active').default,
                fetchPolicy: graphqlService.getFetchPolicyForKey('fetchOrdersActive', cache)
            })
            this.setOrdersActive(res)
            return res
        } catch (e) {
            console.log(e)
            return []
        }
    }, {
        name: 'fetchOrdersActive',
        pollingInterval: 2 * 60 * 1000
    })

    fetchOrdersHistory = task(async ({limit, cache = 1000 * 60 * 30}: { limit?: number } & TFetchableOptions = {}) => {
        try {
            const records: ServiceOrder[] = await graphqlService.queryWrapped({
                variables: {limit},
                query: require('@core/sale/gql/query/service_order_list').default,
                fetchPolicy: graphqlService.getFetchPolicyForKey('fetchOrdersHistory', cache, {limit})
            })
            if (records && records.length) {
                this.setOrdersHistory(records)
            }
            return records
        } catch (e) {
            console.log(e)
            return []
        }
    })

    @task
    fetchClientCard = (async (variables: QuerySalePubClientCardFetchArgs = {}) => {
        try {
            const res = await QUERY_CLIENT_CARD.request({variables})
            runInAction(() => {
                if (res)
                    this.userClientCard = new SaleClientCardModel(res)
            })
            return res
        } catch (e) {
            console.log(e)
        }
    }) as TQueryClientCardTask


    @computed get userOrdersActiveHash(): string {
        logComputed(this, 'userOrdersActiveHash')
        return (this.userOrdersActive || []).map((order) => order.ID).join('-')
    }

    @computed get userHistoryHash(): string {
        logComputed(this, 'userHistoryHash')
        return (this.userOrdersHistory || []).map(order => order.ID).join('-')
    }

    @action
    async setUserDefaultProfile(profileId: number) {

        try {
            const res = await MUTATE_PROFILE_DEFAULT.request({
                variables: {
                    id: profileId
                }
            })
            if (res.state.success) {
               this.fetchOrderProfiles()
            }
        } catch (e) {

        }

        /*
        this.userOrderProfiles.forEach(profile => {
            if (profile.ID === profileId) {
                profile.IS_DEFAULT = true
            } else {
                profile.IS_DEFAULT = false
            }
        })
         */
    }

    getUserDefaultProfile(defaultType: 'first' | 'last' | 'lastUsed' | false = 'first'): OrderProfileModel | null | undefined {
        let profile = this.userOrderProfiles.find(profile => {
            return profile.IS_DEFAULT
        })
        if (!profile) {
            switch (defaultType) {
                case "first":
                    profile = this.userOrderProfiles[0]
                    break
                case "last":
                    profile = this.userOrderProfiles[this.userOrderProfiles.length - 1]
                    break
            }
        }
        return profile
    }

    getProfileById(id: number) {
        return this.userOrderProfiles.find(profile => profile.ID === id)
    }

    @computed
    get orderStatusesComputed() {
        logComputed(this, 'orderStatusesComputed')
        return this.orderStatuses.filter(status => status.TYPE === 'O')
    }

    @action
    async setViewedGiftIds(ids: number[] = []) {
        for (const id of ids) {
            this.viewedGiftIds[id] = id
        }
    }

    @action
    mergeActiveOrder(order: Order) {
        const orderModel = new OrderModel(order)
        const foundIndex = this.userOrdersActive.findIndex(item => item.ID === order.ID)

        if (orderModel.IS_ACTIVE) {
            if (foundIndex === -1) {
                this.userOrdersActive = [orderModel, ...this.userOrdersActive]
            } else {
                this.userOrdersActive[foundIndex] = orderModel
            }
        } else {
            if (foundIndex >= 0) {
                this.userOrdersActive.splice(foundIndex, 1);
            }
        }

        return orderModel
    }

    @computed
    get userActiveOrderId() {
        logComputed(this, 'userActiveOrderId')
        if (this.userOrdersActive.length)
            return this.userOrdersActive[0].ID
    }

    @action
    logout() {
        this.userOrdersActive = []
        this.userOrderProfiles = []
    }

    @action
    mergeProfile(profile: OrderProfileModel) {
        const foundIndex = this.userOrderProfiles.findIndex(item => item.ID === profile.ID)
        if (foundIndex === -1) {
            this.userOrderProfiles = [profile, ...this.userOrderProfiles]
        } else {
            this.userOrderProfiles[foundIndex] = profile
            this.userOrderProfiles = [...this.userOrderProfiles]
        }
        return profile
    }

    @action
    deleteProfile(profile: OrderProfileModel | number) {
        const profileId = typeof profile === 'number' ? profile : profile.ID
        this.userOrderProfiles = this.userOrderProfiles.filter(item => item.ID !== profileId)
    }

    @computed
    get bonusesLoading() {
        return this.fetchClientCard.pending
    }

    navActiveOrder(orderId: number) {
        this.stores().router.push('/user/order?orderId=' + orderId)
    }

    @action
    runAction(action: TActionSale) {

        const {params, payload} = action

        switch (action.type) {
            case 'orderView': {
                const orderId = toInt(params?.orderId) || toInt(payload)
                orderId && this.navActiveOrder(orderId)
                break
            }
            case 'reloadActiveOrders': {
                this.fetchOrdersActive({})
                break
            }
            case 'reloadHistoryOrders': {
                this.fetchOrdersHistory({})
                break
            }
            case 'reloadProfiles': {
                this.fetchOrderProfiles()
                break
            }
            case 'reloadClientCard': {
                this.fetchClientCard({
                    refetch: !!params?.refetch
                })
                break
            }
        }
    }
}

export default SaleStore

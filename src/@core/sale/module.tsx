import {TAppStores, TComponentRender, TComponentRenderers, TDeferredFetchTask} from "@core/main/types"
import React from "react"

export function scopeQuery(query: any, name: string) {

    switch (name) {
        case 'app':
            query = query.add(require('./gql/scope/app').default, {})
            break
        case 'session':
            query = query.add(require('./gql/scope/session').default, {})
            break
        case 'user':
            query = query.add(require('./gql/scope/user').default, {})
            break
    }

    return query
}

export function deferredFetchTasks(tasks: TDeferredFetchTask[], stores: TAppStores) {


    tasks.push({
        name: 'fetchClientCard',
        condition: () => !stores.sale.userClientCard || !stores.sale.userClientCard.FETCHED_ACTUAL,
        task: stores.sale.fetchClientCard
    })
    /*

    tasks.push({
        name: 'fetchOrdersHistory',
        condition: () => !stores.sale.userOrdersHistory.length,
        task: stores.sale.fetchOrdersHistory,
        args: [{limit: 3}]
    })

     */

    return tasks
}

export function modals(list: TComponentRenderers) {

    const BasketDialog = require('../../components/sale/dialog/vorder').default
    const OrderPayDialog = require('~com/sale/dialog/order-pay').default
    const OrderCancelDialog = require('~com/sale/dialog/order-cancel').default
    const ProfileDialog = require('~com/sale/dialog/profile').default
    const ProfileEditDialog = require('~com/sale/dialog/profile-edit').default
    const ProfileMapDialog = require('~com/sale/dialog/profile-map').default
    const DeliveryEditDialog = require('~com/sale/dialog/delivery').default

    const VorderBenefitDialog = require('~com/sale/dialog/vorder/dialogs/benefit').default
    const VorderDeliveryDialog = require('~com/sale/dialog/vorder/dialogs/delivery').default
    const VorderTimeDialog = require('~com/sale/dialog/vorder/dialogs/time').default
    const VorderPaymentDialog = require('~com/sale/dialog/vorder/dialogs/payment').default
    const VorderPickupDialog = require('~com/sale/dialog/vorder/dialogs/pickup').default
    const VorderCulteryDialog = require('~com/sale/dialog/vorder/dialogs/cultery').default
    const VorderCommentDialog = require('~com/sale/dialog/vorder/dialogs/comment').default
    const VorderConfirmDialog = require('~com/sale/dialog/vorder/dialogs/confirm').default

    const GiftsDialog = require('~com/sale/dialog/gifts-dialog').default

    list.push({
        name: 'delivery-edit',
        open: ({stores}) => stores.deliveryEditDialog.show(),
        component: ({index}) => <DeliveryEditDialog key={index}/>,
        condition: ({stores}) => stores.deliveryEditDialog.visible
    })

    list.push({
        name: 'address-profile-edit',
        open: ({stores}) => stores.profileEditDialog.show(),
        component: ({index}) => <ProfileEditDialog key={index}/>,
        condition: ({stores}) => stores.profileEditDialog.visible
    })

    list.push({
        name: 'address-profile-map',
        open: ({stores}) => stores.profileMapDialog.show(),
        component: ({index}) => <ProfileMapDialog key={index}/>,
        condition: ({stores}) => stores.profileMapDialog.visible
    })

    list.push({
        name: 'address-profiles',
        open: ({stores}) => stores.profileDialog.show(),
        component: ({index}) => <ProfileDialog key={index}/>,
        condition: ({stores}) => stores.profileDialog.visible
    })

    list.push({
        name: 'basket',
        open: ({stores}) => stores.vorder.showBasketModal(),
        component: ({index}) => <BasketDialog key={index}/>,
        condition: ({stores}) => true
    })

    list.push({
        component: ({index}) => <OrderPayDialog key={index}/>,
        condition: ({stores}) => stores.orderPayDialog.visible
    })

    list.push({
        component: ({index}) => <OrderCancelDialog key={index}/>,
        condition: ({stores}) => stores.orderCancelDialog.visible
    })

    list.push({
        component: ({index}) => <VorderBenefitDialog key={index}/>,
        condition: ({stores}) => stores.vorder.dialogs.benefit.visible
    })

    list.push({
        component: ({index}) => <VorderDeliveryDialog key={index}/>,
        condition: ({stores}) => stores.vorder.dialogs.delivery.visible
    })

    list.push({
        component: ({index}) => <VorderTimeDialog key={index}/>,
        condition: ({stores}) => stores.vorder.dialogs.time.visible
    })

    list.push({
        component: ({index}) => <VorderPaymentDialog key={index}/>,
        condition: ({stores}) => stores.vorder.dialogs.payment.visible
    })

    list.push({
        component: ({index}) => <VorderPickupDialog key={index}/>,
        condition: ({stores}) => stores.vorder.dialogs.pickup.visible
    })

    list.push({
        component: ({index}) => <VorderCulteryDialog key={index}/>,
        condition: ({stores}) => stores.vorder.dialogs.cultery.visible
    })

    list.push({
        component: ({index}) => <VorderCommentDialog key={index}/>,
        condition: ({stores}) => stores.vorder.dialogs.comment.visible
    })

    list.push({
        component: ({index}) => <VorderConfirmDialog key={index}/>,
        condition: ({stores}) => stores.vorder.dialogs.confirm.visible
    })

    list.push({
        component: ({index}) => <GiftsDialog key={index}/>,
        condition: ({stores}) => stores.giftsDialog.visible
    })
}

export function busComponents(list: TComponentRender[]) {
    const SaleBus = require('~com/sale/bus').SaleBus
    list.push((index) => <SaleBus key={'sale'}/>)
}





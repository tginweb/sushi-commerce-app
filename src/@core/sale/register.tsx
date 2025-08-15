export function stores() {
    return {
        sale: require('./store/store').default,
        vorder: require('./store/vorder').default,
        fav: require('./store/fav').default,
        deliveryEditDialog: require('./store/delivery-edit-dialog').default,
        profileDialog: require('./store/profile-dialog').default,
        profileEditDialog: require('./store/profile-edit-dialog').default,
        profileMapDialog: require('./store/profile-map-dialog').default,
        orderPayDialog: require('./store/order-pay-dialog').default,
        orderCancelDialog: require('./store/order-cancel-dialog').default,
        giftsDialog: require('./store/gifts-dialog').default,
    }
}
export function module() {
    return require('./module')
}

export function stores() {
    return {
        app: require('./store/app').default,
        specialOffers: require('./store/special-offers').default,
        contactsDialog: require('./store/contacts-dialog').default,
    }
}

export function module() {
    return require('./module')
}

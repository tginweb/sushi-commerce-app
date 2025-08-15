export function stores() {
    return {
        page: require('./store/store').default,
        pageDialog: require('./store/page-dialog').default,
    }
}

export function module() {
    return require('./module')
}

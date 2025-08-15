export function stores() {
    return {
        user: require('./store/store').default,
        logoutDialog: require('./store/logout-dialog').default,
    }
}
export function module() {
    return require('./module')
}

export function stores() {
    return {
        promo: require('./store/store').default,
    }
}
export function module() {
    return require('./module')
}

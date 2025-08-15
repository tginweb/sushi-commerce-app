export function stores() {
    return {
        search: require('./store/store').default,
    }
}
export function module() {
    return require('./module')
}

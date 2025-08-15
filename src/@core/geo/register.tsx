export function stores() {
    return {
        geo: require('./store/store').default,
    }
}
export function module() {
    return require('./module')
}

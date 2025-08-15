export function stores() {
    return {
        company: require('./store/store').default,
    }
}
export function module() {
    return require('./module')
}

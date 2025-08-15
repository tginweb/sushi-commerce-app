export function stores() {
    return {
        offer: require('./store/store').default,
    }
}

export function module() {
    return require('./module')
}

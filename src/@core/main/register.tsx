export function stores() {
    return {
        main: require('./store/main').default,
        debug: require('./store/debug').default,
        settings: require('./store/settings').default,
        menu: require('./store/menu').default,
        push: require('./store/push').default,
        router: require('./store/router').default,
    }
}

export function services() {
    return {
        bus: require('./service/bus').default,
        config: require('./service/config').default,
        websocket: require('./service/websoket').default,
        crypto: require('./service/crypto').default,
        date: require('./service/date').default,
        graphql: require('./service/graphql').default,
        rest: require('./service/rest').default,
        util: require('./service/util').default,
        linking: require('./service/linking').default,
        html: require('./service/html').default,
    }
}

export function module() {
    return require('./module')
}

export function stores() {
    return {
        catalog: require('./store/catalog').default,
        catalogConstructor: require('./store/constructor').default,
        productPrimaryDialog: require('./store/product-primary-dialog').default,
        productSecondaryDialog: require('./store/product-secondary-dialog').default,
        sectionsDialog: require('./store/sections-dialog').default,
    }
}

export function services() {
    return {
        catalogUtil: require('./service/util').default,
    }
}

export function module() {
    return require('./module')
}



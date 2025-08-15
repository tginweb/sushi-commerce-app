export function stores() {
    return {
        ui: require('./store/ui').default,
        galleryDialog: require('./store/gallery-dialog').default,
    }
}

export function services() {
    return {
        imager: new (require('./service/imager').ImagerService)(),
    }
}

export function module() {
    return require('./module')
}

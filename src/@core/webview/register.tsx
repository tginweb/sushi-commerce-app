export function stores() {
    return {
        webview: require('./store/webview').default,
        webviewDialog: require('./store/webview-dialog').default,
    }
}

export function services() {
    return {
        webviewUtil: require('./service/util').default,
    }
}

export function module() {
    return require('./module')
}

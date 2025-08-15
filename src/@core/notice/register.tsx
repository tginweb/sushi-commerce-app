export function stores() {
    return {
        notice: require('./store/store').default,
        noticeDialog: require('./store/notice-dialog').default,
        noticesDialog: require('./store/notices-dialog').default,
    }
}

export function services() {
    return {
    }
}

export function module() {
    return require('./module')
}

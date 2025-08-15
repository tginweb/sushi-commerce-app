export function stores() {
    return {
        captchaDialog: require('./store/captcha-dialog').default,
    }
}
export function module() {
    return require('./module')
}

export function stores() {
    return {
        faq: require('./store/store').default,
        faqDialog: require('./store/faq-dialog').default,
    }
}

export function module() {
    return require('./module')
}

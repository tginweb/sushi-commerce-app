export default class RequestError extends Error {
    category?: any
    code?: any
    data?: any
    context?: any
    constructor(message: string, data: any = {}, ctx = {}) {
        super(message)
        this.name = data.name
        this.category = data.category
        this.code = data.code
        this.data = data.data || {}
        this.context = ctx
    }
}

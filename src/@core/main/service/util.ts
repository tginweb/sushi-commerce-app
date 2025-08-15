import CommonService from "@core/main/lib/service/common";

export class UtilService extends CommonService {
    constructor() {
        super()
        Object.assign(this as any, require('../util'))
    }
}

const service = new UtilService()

export const utilService = service

export default service

import {IService} from "@core/main/types";

class CommonService implements IService {

    booted: boolean = false
    inited: boolean = false

    services() {
        return require('~services').services
    }

    stores() {
        return require('~stores').stores
    }
}

export default CommonService

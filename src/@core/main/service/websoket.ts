import CommonService from "@core/main/lib/service/common";
import {TWebsocketMessage} from "@core/main/types";

export class WebsocketService extends CommonService {

    constructor() {
        super()
    }

    sendMessage(message: TWebsocketMessage) {
        this.services().bus.emit('websocket:sendMessage', message)
    }
}

export const service = new WebsocketService()
export const websocketService = service
export default service



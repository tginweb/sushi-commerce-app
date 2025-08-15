import EventEmitter from "eventemitter3"
import {TMessage} from "@core/main/types"
import CommonService from "@core/main/lib/service/common";

export class BusService extends CommonService {

    public emitter: EventEmitter

    constructor() {
        super()
        this.emitter = new EventEmitter()
    }

    boot() {
        this.emitter.emit('emitter')
        this.booted = true
    }

    off(name: string, cb: (...args: any[]) => void) {
        this.emitter.off(name, cb)
    }

    on(name: string, cb: (...args: any[]) => void) {
        this.emitter.on(name, cb)
    }

    emit(name: string, ...args: any[]) {
        this.emitter.emit(name, ...args)
    }

    showNotice(message: TMessage) {
        this.emitter.emit('processNotice', message)
    }

    showNotices(messages: TMessage[]) {
        this.emitter.emit('processNotices', messages)
    }

    showAlert(message: TMessage) {
        this.emitter.emit('processAlert', message)
    }

    showAlerts(messages: TMessage[]) {
        this.emitter.emit('processAlerts', messages)
    }

    hideToasts() {
        this.emitter.emit('hideToasts')
    }

    statusBarShow(message: TMessage) {
        this.emitter.emit('statusBar.show', message)
    }

    statusBarHide() {
        this.emitter.emit('statusBar.hide')
    }

    registerBack(cb: any) {

    }
}

const service = new BusService()
export const busService = service
export default service


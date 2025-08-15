import {TDebugDeliveryChannelType, TDebugEvent, TDebugEventScope, TDebugEventType} from "@core/main/types";
import {randID} from "@core/main/util/base";
import deepSet from "@core/main/util/base/deepSet";
import toString from "@core/main/util/base/toString";
import isScalar from "@core/main/util/base/isScalar";

export class DebugEvent {
    uid?: string
    name?: string
    type: TDebugEventType
    message?: string
    data?: any
    scope?: TDebugEventScope | TDebugEventScope[]
    channel?: TDebugDeliveryChannelType
    session?: {
        sessionId: string
        userId: number
        phone: string
        vorderId: number
    }
    createdAt: number = 0
    finishedAt: number = 0

    constructor(event: Partial<TDebugEvent> = {}) {
        this.uid = randID()
        this.name = event.name
        this.type = event.type || 'info'
        this.message = event.message
        this.data = event.data
        this.scope = event.scope
        this.channel = event.channel
        this.session = event.session
        this.createdAt = event.createdAt || Date.now()
    }

    finish(event?: Partial<TDebugEvent>) {
        if (!this.finishedAt)
            this.finishedAt = Date.now()
        event && this.updatePartial(event)
    }

    updatePartial(event?: Partial<TDebugEvent>) {
        if (event) {
            for (const [name, value] of Object.entries(event)) {
                deepSet(this, name, value)
            }
        }
    }

    getDuration() {
        return (this.finishedAt - this.createdAt) / 1000
    }

    getServerData() {
        this.finish()
        return {
            createdAt: this.createdAt,
            finishedAt: this.finishedAt,
            uid: this.uid,
            name: this.name,
            type: this.type,
            message: this.message,
            data: this.data,
            scope: this.scope,
            channel: this.channel,
            session: this.session,
            duration: this.getDuration()
        }
    }

    SIMPLIFY_MAX_DEPTH = 2
    SIMPLIFY_MAX_VALUE_LENGTH = 20

    dataSimplify(data: any, depth = 0): any {
        if (isScalar(data)) {
            let valueStr = toString(data)
            return valueStr.length > this.SIMPLIFY_MAX_VALUE_LENGTH ? valueStr.substring(0, this.SIMPLIFY_MAX_VALUE_LENGTH) + '...' : valueStr
        } else if (Array.isArray(data)) {
            if (depth < this.SIMPLIFY_MAX_DEPTH) {
                return data.map(item => this.dataSimplify(item, depth + 1))
            } else {
                return 'Array[' + data.length + ']'
            }
        } else if (typeof data === 'object') {
            const itemResult: any = {}
            let index = 0
            for (const [name, value] of Object.entries(data)) {
                let valueRes
                if (typeof value === 'object' && depth < this.SIMPLIFY_MAX_DEPTH) {
                    valueRes = this.dataSimplify(value, depth + 1)
                } else {
                    let valueRes = toString(value)
                    valueRes = valueRes.length > this.SIMPLIFY_MAX_VALUE_LENGTH ? valueRes.substring(0, this.SIMPLIFY_MAX_VALUE_LENGTH) + '...' : valueRes
                    if (index > 5 && !['id', 'ID', 'name', 'NAME'].includes(name)) {
                        valueRes = '...'
                    }
                }
                itemResult[name] = valueRes
                index++
            }
            return itemResult
        }
    }

    getEventHistoryModel() {

        let eventData: any = this.data

        try {
            const json = JSON.stringify(eventData)
            if (json.length > 1500) {
                eventData = this.dataSimplify(eventData)
            }
        } catch (e) {
            eventData = {}
        }

        return new DebugEvent({
            uid: this.uid,
            name: this.name,
            type: this.type,
            message: this.message,
            data: eventData,
            scope: this.scope,
            channel: this.channel,
            session: this.session,
            createdAt: this.createdAt,
        })
    }
}


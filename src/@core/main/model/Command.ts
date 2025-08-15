import {makeObservable} from "mobx"
import {Command} from "~gql/api";
import CommonStore from "@core/main/lib/store/common";

export class CommandModel extends CommonStore {

    code?: string
    confirm?: string
    params?: any
    path?: string
    type?: string

    constructor(data?: Command, observer: boolean = true) {
        super()
        if (data) {
            Object.assign(this as any, data)
        }
        if (observer)
            makeObservable(this)
    }

    run() {


    }
}


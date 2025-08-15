import {action, computed, makeObservable, observable, toJS} from "mobx"
import {RequestModel} from "@core/main/model/Request";

type TRequestsMap = Record<string, RequestModel>

export class RequestsModel<T = TRequestsMap> {

    @observable
    items: T = {} as T

    constructor(items: Record<string, Partial<RequestModel>> = {}) {
        for (const [name, item] of Object.entries(items)) {
            this.getItems()[name] = new RequestModel(name, item)
        }
        makeObservable(this)
    }

    getItems(): TRequestsMap {
        return this.items as any
    }

    @action
    get(name: string) {
        if (!this.getItems()[name])
            this.getItems()[name] = new RequestModel(name)
        return this.getItems()[name]
    }

    @action
    start(name: string) {
        this.get(name).start(name)
    }

    @action
    run(name: string) {
        this.get(name).run()
    }

    @action
    resolve(name: string) {
        this.get(name).resolve()
    }

    @action
    reject(name: string) {
        this.get(name).resolve()
    }

    isResolving(name: string) {
        return this.get(name).resolving
    }

    @computed
    get isResolvingAny(): boolean {
        return !!Object.values(this.getItems()).find(item => item.resolving)
    }

    @computed
    get toJson() {
        return Object.values(this.getItems()).map(item => item.toJson)
    }
}


import {action, computed, makeObservable, observable, toJS} from "mobx"

export class DatasourceModel {

    @observable
    name?: string

    @observable
    pending: boolean = true

    @observable
    resolving?: boolean

    @observable
    resolved?: boolean

    @observable
    resolvedOnce?: boolean

    @observable
    rejected?: boolean

    @observable
    state: 'pending' | 'resolving' | 'resolved' | 'rejected'  = 'pending'

    constructor(name?: string, data?: any) {
        this.name = name
        if (data) {
            Object.assign(this as any, data)
        }
        makeObservable(this)
    }

    @action
    start(name: string) {
        this.name = name
        this.resolving = true
        this.resolved = false
        this.rejected = false
        this.pending = false
        this.resolvedOnce = false
        this.state = 'resolving'
    }

    @action
    run() {
        this.resolving = true
        this.resolved = false
        this.rejected = false
        this.pending = false
        this.state = 'resolving'
    }

    @action
    resolve() {
        this.resolved = true
        this.rejected = false
        this.resolving = false
        this.resolvedOnce = true
    }

    @action
    reject() {
        this.resolved = false
        this.rejected = true
        this.resolving = false
    }

    @computed
    get toJson() {
        return toJS(this)
    }
}


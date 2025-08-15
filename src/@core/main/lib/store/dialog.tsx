import {action, makeObservable, observable} from "mobx";
import {TCommonDialogProps} from "@core/main/types";

class DialogStore<T extends TCommonDialogProps> {

    inited: boolean = false

    @observable
    visible: boolean = false

    @observable
    props: T = {} as T

    constructor(props: Partial<T> = {} as Partial<T>) {
        this.props = props as T
        makeObservable(this)
    }

    onSuccess(data?: any) {
        if (this.props.onSuccess) {
            this.props.onSuccess(data)
        }
    }

    @action
    show(props: T = {} as T) {
        this.visible = true
        if (props)
            this.props = props
    }

    @action
    hide(clearProps = false) {
        this.visible = false
        if (this.props && this.props.onCloseOnce) {
            this.props.onCloseOnce()
            this.props.onCloseOnce = null
        }
        if (clearProps) {
            this.props = {} as T
        }
        // @ts-ignore
        this.onHide && this.onHide()
    }

    @action
    addProps(props: Partial<T>) {
        this.props = {
            ...this.props,
            ...props
        }
    }

    stores() {
        return require('~stores').stores
    }
}

export default DialogStore

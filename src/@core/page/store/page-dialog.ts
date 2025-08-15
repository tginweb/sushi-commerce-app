import {action, makeObservable} from "mobx"
import DialogStore from "@core/main/lib/store/dialog";
import {TCommonDialogProps} from "@core/main/types";

export type TPageDialogProps = TCommonDialogProps & {
    code: string
}

export abstract class PageDialogStore extends DialogStore<TPageDialogProps> {
    constructor() {
        super()
        makeObservable(this)
    }

    @action
    showPage(code: string) {
        this.show({
            code
        })
    }
}

export default PageDialogStore

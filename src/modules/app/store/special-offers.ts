import {makeObservable} from "mobx"
import DialogStore from "@core/main/lib/store/dialog";

export type TSpecialOffersDialogProps = {}

export class SpecialOffersStore extends DialogStore<TSpecialOffersDialogProps> {

    constructor() {
        super()
        makeObservable(this)
    }

}

export default SpecialOffersStore

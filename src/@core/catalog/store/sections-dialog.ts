import {makeObservable} from "mobx"
import DialogStore from "@core/main/lib/store/dialog";

export type TSectionsDialogProps = {}

export class SectionsDialogStore extends DialogStore<TSectionsDialogProps> {

    constructor() {
        super()
        makeObservable(this)
    }

}

export default SectionsDialogStore

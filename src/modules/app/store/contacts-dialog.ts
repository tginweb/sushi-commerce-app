import {makeObservable} from "mobx"
import DialogStore from "@core/main/lib/store/dialog";

export type TContactsDialogProps = {}

export class ContactsDialogStore extends DialogStore<TContactsDialogProps> {

    constructor() {
        super()
        makeObservable(this)
    }
}

export default ContactsDialogStore

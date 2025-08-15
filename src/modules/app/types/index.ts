import {AppStore} from '../store/app'
import SpecialOffersStore from "../store/special-offers";
import ContactsDialogStore from "../store/contacts-dialog";

export type TTabbarTooltip = {
    index: number | null
    content?: any
    callback?: any
}

declare module "@core/main/types" {
    interface TAppStores {
        app: AppStore
        specialOffers: SpecialOffersStore
        contactsDialog: ContactsDialogStore
    }
}

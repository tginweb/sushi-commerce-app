import {FaqStore} from "./store/store";
import {FaqDialogStore} from "./store/faq-dialog";

declare module "@core/main/types" {
    interface TAppStores {
        faq: FaqStore,
        faqDialog: FaqDialogStore
    }
}

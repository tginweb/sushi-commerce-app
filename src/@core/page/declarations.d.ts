import {PageStore} from "./store/store";
import PageDialogStore from "@core/page/store/page-dialog";

declare module "@core/main/types" {
    interface TAppStores {
        page: PageStore
        pageDialog: PageDialogStore
    }
}




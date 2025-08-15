import {UserStore} from "./store/store";
import {LogoutDialogStore} from "./store/logout-dialog";

declare module "@core/main/types" {
    interface TAppStores {
        user: UserStore,
        logoutDialog: LogoutDialogStore,
    }
}


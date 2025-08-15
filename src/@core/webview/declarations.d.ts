import {WebviewUtilService} from "./service/util";
import {WebviewStore} from "./store/webview"
import {WebviewDialogStore} from "./store/webview-dialog"

declare module "@core/main/types" {
    interface TAppServices {
        webviewUtil: WebviewUtilService
    }
}

declare module "@core/main/types" {
    interface TAppStores {
        webview: WebviewStore,
        webviewDialog: WebviewDialogStore,
    }
}



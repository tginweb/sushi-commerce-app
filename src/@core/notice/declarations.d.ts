import {NoticeDialogStore} from "./store/notice-dialog"
import {NoticesDialogStore} from "./store/notices-dialog"
import {NoticeStore} from "./store/store"

declare module "@core/main/types" {
    interface TAppServices {

    }
}

declare module "@core/main/types" {
    interface TAppStores {
        notice: NoticeStore,
        noticeDialog: NoticeDialogStore,
        noticesDialog: NoticesDialogStore,
    }
}



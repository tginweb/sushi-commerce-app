import {makeObservable} from "mobx"
import DialogStore from "@core/main/lib/store/dialog";
import {TCommonDialogProps} from "@core/main/types";
import {NoticeModel} from "@core/notice/model/Notice";

export type TNoticeDialogProps = TCommonDialogProps & {
    notice: NoticeModel
}

export class NoticeDialogStore extends DialogStore<TNoticeDialogProps> {

    constructor() {
        super()
        makeObservable(this)
    }
}

export default NoticeDialogStore

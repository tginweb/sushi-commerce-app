import {makeObservable} from "mobx"
import DialogStore from "@core/main/lib/store/dialog";
import {TCommonDialogProps} from "@core/main/types";
import {DimensionValue} from "react-native";

export type TWebviewDialogProps = TCommonDialogProps & {
    url: string
    title?: string | null
    titleAuto?: boolean
    fullscreen?: boolean | null
    bottomOffsetTabbar?: boolean
    width?: DimensionValue | null
    height?: DimensionValue | null
    mode?: 'sheet' | 'dialog'
}

export class WebviewDialogStore extends DialogStore<TWebviewDialogProps> {

    constructor() {
        super()
        makeObservable(this)
    }
}

export default WebviewDialogStore

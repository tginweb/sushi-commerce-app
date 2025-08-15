import {TAction} from "@core/main/types";

export type TActionWebviewDialog = TActionWebviewDialogNav

export type TActionWebviewDialogNav = TAction & {
    channel: 'webview' | 'webview-site'
    type: 'nav'
}

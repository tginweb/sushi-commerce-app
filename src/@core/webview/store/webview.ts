import {action, makeObservable} from "mobx"
import CommonStore from "@core/main/lib/store/common";
import {TWebviewDialogProps} from "@core/webview/store/webview-dialog";
import {TActionWebviewDialog} from "@core/webview/types";

export class WebviewStore extends CommonStore {

    constructor() {
        super()
        makeObservable(this)
    }

    boot() {
        this.stores().menu.registerActionChannel('webview', this.runAction.bind(this))
        this.stores().menu.registerActionChannel('webview-site', this.runAction.bind(this))
    }

    @action
    async runAction(action: TActionWebviewDialog) {

        let {params, pathFull} = action

        params = params || {}

        switch (action.type) {
            default:
            case "nav":

                if (!pathFull)
                    return;

                const url = action.channel === 'webview-site' ?
                    this.stores().router.makeSiteUrl(pathFull, null, !!params.addSession)
                    :
                    this.stores().router.makeWebUrl(pathFull)

                const props: TWebviewDialogProps = {
                    mode: 'sheet',
                    fullscreen: true,
                    bottomOffsetTabbar: true,
                    ...action.params,
                    url,
                }

                this.stores().debug.info('Action webview:', props)
                this.stores().webviewDialog.show(props)
        }
    }

}

export default WebviewStore

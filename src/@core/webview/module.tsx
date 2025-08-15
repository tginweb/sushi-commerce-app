import {TComponentRenderers} from "@core/main/types"
import React from "react"


export function modals(list: TComponentRenderers) {
    const WebviewModal = require('~com/webview/dialog/webview-modal').default
    list.push({
        component: ({index}) => <WebviewModal key={index}/>,
        condition: ({stores}) => stores.webviewDialog.visible
    })
}



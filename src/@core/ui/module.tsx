import {TComponentRender, TComponentRenderers} from "@core/main/types";
import React from "react";

export function modals(list: TComponentRenderers) {
    const GalleryDialog = require('~com/ui/dialog/gallery-dialog').default

    list.push({
        component: ({index}) => <GalleryDialog key={index}/>,
        condition: ({stores}) => stores.galleryDialog.visible
    })
}

export function busComponents(list: TComponentRender[]) {
    const ToastBus = require('~ui/toast/bus').ToastBus
    list.push((index) => <ToastBus key={'toast'}/>)
}

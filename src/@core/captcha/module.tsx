import {TComponentRenderers} from "@core/main/types";
import React from "react";

export function modals(list: TComponentRenderers) {
    const CaptchaDialog = require('~com/captcha/dialog/captcha').default
    list.push({
        component: ({index}) => <CaptchaDialog key={index}/>,
        condition: ({stores}) => stores.captchaDialog.visible
    })
}

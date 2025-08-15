import React from "react";
import {TComponentRender, TComponentRenderInfo} from "@core/main/types";

export default function componentRender(com: TComponentRender, props: any = {}, ctx: any = {}): React.ReactNode {

    if (!com)
        return <></>

    if (typeof com === 'object') {

        com = com as TComponentRenderInfo

        let _props

        if (com.props) {
            _props = {...com.props, ...props}
        } else {
            _props = props
        }

        if (com.condition) {
            let condRes
            if (typeof com.condition === 'function') {
                condRes = com.condition(ctx)
            } else {
                condRes = com.condition
            }
            if (condRes) {
                return com.component(_props)
            }
        } else {
            return com.component(_props)
        }
    } else if (typeof com === 'function') {
        return com(props)
    } else {
        return com
    }
}

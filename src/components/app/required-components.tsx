import React from "react"
import {observer} from "mobx-react";
import {Websocket} from "~com/app/websocket";

type TProps = {}

export const RequiredComponents: React.FC<TProps> = observer(({}) => {
    return <>
        <Websocket/>
    </>
})

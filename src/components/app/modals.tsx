import React from "react"
import {useStores} from "~stores"
import {observer} from "mobx-react"
import {app} from "~modules/info"
import componentRender from "@core/main/util/react/componentRender"
import Draggable from "react-native-draggable"
import {COLORS, wHeight, wWidth} from "~assets/design"
import {ConsoleOverlay} from "~com/app/dialog/console-overlay";

type TProps = {}

export const Modals: React.FC<TProps> = observer(({}) => {
    const stores = useStores()
    const {debug} = stores

    return (
        <>
            {
                debug.consoleLogOverlay && <ConsoleOverlay/>
            }
            {
                stores.debug.showBubble && true && (
                    <Draggable
                        x={wWidth - 60}
                        y={wHeight - 110}
                        z={20000}
                        renderSize={50}
                        renderColor={COLORS.primary + '55'}
                        renderText='ADM'
                        isCircle
                        onShortPressRelease={() => {
                            stores.debug.showDevModal()
                        }}
                        onLongPress={() => {
                            stores.debug.consoleLogOverlayToggle()
                        }}

                    />
                )
            }
            {app.getModals().map((modal: any, index: number) => componentRender(modal, {index}, {stores}))}
        </>
    )
})

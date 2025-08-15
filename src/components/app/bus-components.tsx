import React, {useEffect, useState} from "react"
import {observer} from "mobx-react"
import {UiLoading, UiLoadingProps} from "~ui/loading";
import {useServices} from "~services";

type TProps = {}

export const AppBus: React.FC<TProps> = observer(({}) => {

    const { bus} = useServices()

    const [loadingOverlay, setLoadingOverlay] = useState<Partial<UiLoadingProps> | null>(null)

    const loadingOverlayShow = (props?: Partial<UiLoadingProps>) => {
        setLoadingOverlay(props || {})
    }

    const loadingOverlayHide = () => {
        setLoadingOverlay(null)
    }

    useEffect(() => {
        
        bus.emitter.on('bus:loading-overlay.show', loadingOverlayShow)
        bus.emitter.on('bus:loading-overlay.hide', loadingOverlayHide)

        return () => {
            bus.emitter.off('bus:loading-overlay.show', loadingOverlayShow)
            bus.emitter.off('bus:loading-overlay.hide', loadingOverlayHide)
        }

    }, [])

    return <>
        {loadingOverlay && <UiLoading
            preset={'bus'}
            {...loadingOverlay}
        />}
    </>
})


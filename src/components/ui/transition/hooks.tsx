import {PropsWithChildren, useEffect, useRef, useState} from "react"
import {ViewProps} from "react-native"
import {AnimatableProps} from "react-native-animatable";

export type TUiTransitionProps = PropsWithChildren<AnimatableProps<ViewProps> & {
    visible?: boolean,
    show?: AnimatableProps<ViewProps>
    hide?: AnimatableProps<ViewProps>
    delay?: number
    duration?: number
    preset?: keyof typeof presets
}>

export function useCommon(props: TUiTransitionProps) {

    const {
        children,
        visible,
        show = {},
        hide = {},
        duration = 2000,
        delay = 0,
        ...restProps
    } = props

    const didMount = useRef(false)

    const [visibleState, setVisibleState] = useState(visible)

    useEffect(() => {
        
        let timeout: any
        if (didMount.current) {
            if (visible) {
                setVisibleState(true)
            } else {
                timeout = setTimeout(() => {
                    setVisibleState(false)
                }, duration - (duration / 100) * 30)
            }
        } else {
            didMount.current = true;
        }
        return () => {
            clearTimeout(timeout)
        }
    }, [visible])

    let stateProps: AnimatableProps<ViewProps> = {
        duration,
        ...(visible ? show : hide)
    }

    return {
        visibleState,
        restProps,
        stateProps
    }
}

export const presets = {
    message: {
        show: {animation: 'zoomIn'},
        hide: {animation: 'zoomOut'},
        duration: 200
    }
}

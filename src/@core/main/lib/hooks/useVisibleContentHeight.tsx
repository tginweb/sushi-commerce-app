import {wHeight} from "~assets/design";
import {useHeaderHeight} from "@react-navigation/elements";
import useKeyboard from "@core/main/lib/hooks/useKeyboard";
import {useStores} from "~stores";

export function useVisibleContentHeight(
    {
        offsetTop = 0,
        offsetBottom = 0,
        offsetBottomNonKeyboard = 0,
        offsetBottomKeyboard = 0,
    }: {
        offsetTop?: number,
        offsetBottom?: number,
        offsetBottomNonKeyboard?: number,
        offsetBottomKeyboard?: number
    }
) {
    const {ui, geo} = useStores()
    const tabbarHeight = ui.appLayoutTabbarHeight
    const headerHeight = useHeaderHeight()
    const keyboard = useKeyboard()

    /*
    console.log({
        wHeight,
        headerHeight,
        keyboardHeight,
        offsetTop
    })
     */

    let res = wHeight

    res -= offsetTop || headerHeight || 0

    if (keyboard.height) {
        res -= keyboard.height + (offsetBottom || offsetBottomKeyboard || 0)
    } else {
        res -= tabbarHeight + (offsetBottom || offsetBottomNonKeyboard || 0)
    }

    return res
}

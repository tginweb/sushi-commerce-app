import {wHeight} from "~assets/design";
import {useHeaderHeight} from "@react-navigation/elements";
import useKeyboard from "@core/main/lib/hooks/useKeyboard";
import {useStores} from "~stores";
import {useSafeAreaInsets} from "react-native-safe-area-context";

export function useScreenLayout(
    {
        offsetTop = 0,
        offsetBottom = 0,
        offsetBottomNonKeyboard = 0,
        offsetBottomKeyboard = 0,
        enable = true
    }: {
        enable?: boolean
        offsetTop?: number,
        offsetBottom?: number,
        offsetBottomNonKeyboard?: number,
        offsetBottomKeyboard?: number
    }
) {

    let contentHeight = wHeight,
        contentVisibleHeight = wHeight,
        contentVisibleHeightWithHeader = wHeight

    const getResult = () => ({
        contentHeight,
        contentVisibleHeight,
        contentVisibleHeightWithHeader
    })

    if (!enable) {
        return getResult()
    }

    const {ui, geo} = useStores()
    const tabbarHeight = ui.appLayoutTabbarHeight
    const headerHeight = ui.appLayoutHeaderHeight
    const keyboard = useKeyboard()
    const insets = useSafeAreaInsets()

    contentHeight -= headerHeight + tabbarHeight
    contentVisibleHeight -= headerHeight

    let bottom = 0

    if (keyboard.height) {
        bottom = keyboard.height + (offsetBottom || offsetBottomKeyboard || 0)
    } else {
        bottom = tabbarHeight + (offsetBottom || offsetBottomNonKeyboard || 0) + insets.bottom
    }

    contentVisibleHeight -= bottom
    contentVisibleHeightWithHeader -= bottom

    return getResult()
}

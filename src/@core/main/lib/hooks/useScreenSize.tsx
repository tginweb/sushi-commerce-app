import {useSafeAreaInsets} from "react-native-safe-area-context";
import {getStatusBarHeight} from "react-native-status-bar-height";
import {useHeaderHeight} from "@react-navigation/elements";
import {wHeight} from "~assets/design";
import {useStores} from "~stores";
import {EdgeInsets} from "react-native-safe-area-context/src/SafeArea.types";

let initialInsets: EdgeInsets & { inited: boolean } = {
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    inited: false
}

export function useScreenSize(
    {
        outOfPage = false,
        useAnomalyInsets = false
    }: {
        outOfPage?: boolean,
        useAnomalyInsets?: boolean
    } = {}) {

    const {ui} = useStores()

    const insets = useSafeAreaInsets()
    const statusBarHeight = getStatusBarHeight()
    const tabbarHeight = ui.appLayoutTabbarHeight
    const headerHeight = !outOfPage ? useHeaderHeight() : ui.appLayoutHeaderHeight

    if (useAnomalyInsets && !initialInsets.inited) {
        initialInsets = {
            ...insets,
            inited: true
        }
    }

    const anomalyBottomInset = useAnomalyInsets ? (initialInsets.bottom < insets.bottom ? insets.bottom : 0) : 0

    /*
    console.log({
        wHeight,
        insets,
        initialInsets,
        statusBarHeight,
        headerHeight,
        tabbarHeight,
        anomalyBottomInset
    })

     */

    let pageContentHeight = wHeight
    let modalHeight = wHeight

    if (headerHeight) {
        pageContentHeight -= headerHeight
    } else {
        pageContentHeight -= insets.top || statusBarHeight
    }

    modalHeight -= insets.bottom

    pageContentHeight -= insets.bottom

    pageContentHeight -= tabbarHeight

    return {
        pageContentHeight,
        modalHeight,
        insets,
        anomalyBottomInset
    }
}

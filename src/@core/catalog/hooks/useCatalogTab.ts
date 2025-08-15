import {useRef, useState} from "react";
import {useStores} from "~stores";
import {TCatalogTab} from "@core/catalog/types";
import dayjs from "dayjs";

export function useCatalogTab(tab: TCatalogTab) {

    const {} = useStores()

    const isCurrentRef = useRef(false)

    const showTime = useRef<dayjs.Dayjs>(null as any)

    const [isCurrent, setIsCurrent] = useState(false)

    const onChangeTab = (newTab: TCatalogTab) => {


        /*
        if (tab.code === newTab.code) {
            setIsCurrent(true)
        } else {
            setIsCurrent(false)
        }
         */
    }

    const setIsCurrentTab = (state: boolean) => {
        isCurrentRef.current = state
        //setIsCurrent(state)
        if (state) {
            // @ts-ignore
            showTime.current = dayjs()
        } else {
            // @ts-ignore
            showTime.current = null
        }
    }

    return {
        setIsCurrentTab,
        isCurrentRef,
        isCurrent,
        setIsCurrent,
        onChangeTab,
        info: tab
    }
}

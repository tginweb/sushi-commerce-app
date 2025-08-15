import {useCallback, useEffect, useRef, useState} from "react";
import extractKey from "@core/main/util/react/extractKey";

export const useMounted = () => {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setTimeout(() => {
            setMounted(true)
        }, 30)
        return () => {
            setMounted(false)
        }
    }, [])

    return mounted
}

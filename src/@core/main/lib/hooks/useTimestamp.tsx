import {useCallback, useEffect, useState} from "react";

export function useTimestamp() {

    const [timestamp, setTimestamp] = useState(Date.now())

    useEffect(useCallback(() => {
        const interval = setInterval(() => {
            setTimestamp(Date.now())
        }, 1000)
        return () => {
            clearInterval(interval)
        }
    }, []), [])

    return {
        timestamp
    }
}


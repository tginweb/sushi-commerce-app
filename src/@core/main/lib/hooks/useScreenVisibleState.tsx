import {useState} from "react";
import {useFocusEffect} from "expo-router";

export function useScreenVisibleState() {

    const [screenVisible, setScreenVisible] = useState(false)

    useFocusEffect(() => {
        setScreenVisible(true)
        return () => {
            setScreenVisible(false)
        }
    })

    return {
        screenVisible,
        setScreenVisible
    }
}


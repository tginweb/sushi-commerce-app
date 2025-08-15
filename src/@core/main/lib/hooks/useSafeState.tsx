import {useState} from "react";

export function useSafeState<T>(initialState?: T): [T | undefined, T | undefined, (v: T) => void] {

    const [value, setValue] = useState<T | undefined>(initialState)
    const [valueSafe, setValueSafe] = useState<T | undefined>(initialState)

    const setValueInternal = (value: T) => {
        setValue(value)
        if (value && (!Array.isArray(value) || !!value.length)) {
            setValueSafe(value)
        }
    }

    return [value, valueSafe, setValueInternal]
}


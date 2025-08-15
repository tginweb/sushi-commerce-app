import {Dispatch, MutableRefObject, SetStateAction, useRef, useState} from "react";

export const useStateRef: <S>(initialState: S | (() => S)) => [S, Dispatch<SetStateAction<S>>, MutableRefObject<S>, (data: S) => void] = <S>(initialState: any) => {
    const [state, setState] = useState<S>(initialState)
    const ref = useRef<S>(state)

    ref.current = state

    const update = (data: S) => {
        setState(data)
        ref.current = data
    }

    return [state, setState, ref, update]
}

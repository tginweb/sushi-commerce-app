import {MutableRefObject, useRef} from "react";

export const useRefSet: <T>(initialValue: T) => MutableRefObject<T> = <S>(data: S) => {
    const ref = useRef(data)
    ref.current = data
    return ref
}

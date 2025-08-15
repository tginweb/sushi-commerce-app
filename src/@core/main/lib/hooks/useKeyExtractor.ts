import {useCallback} from "react";
import extractKey from "@core/main/util/react/extractKey";

export const useKeyExtractor = (field?: string) => {
    return useCallback((item: any, index: number) => {
        return extractKey(item, index, field)
    }, [field])
}

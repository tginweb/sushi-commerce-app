import {useMemo} from "react";
import {TPresetName} from "@core/main/types";
import applyPresets from "@core/main/util/react/applyPresets";

export const usePresets = (props: any, preset: TPresetName | undefined, presets: any, deps?: any[]) => {
    const _deps = deps ? [...deps, preset] : [props, preset]
    return useMemo(() => {
        return applyPresets(props, preset, presets)
    }, _deps)
}

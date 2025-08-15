import {TTemplateValueWrapper} from "@core/main/types";
import reactStringReplace from "react-string-replace";
import deepGet from "lodash/get";
import {ReactNode} from "react";

export function reactTemplater(text: string, vars: any, valueWrapper?: TTemplateValueWrapper): ReactNode[] {
    let reg = /\{(.+)\}/ig;
    return reactStringReplace(text, reg, function (match) {
        let val: any = deepGet(vars, match)
        if (typeof val === "function") {
            val = val(val)
        }
        if (valueWrapper) {
            val = valueWrapper(val)
        }
        return val as ReactNode
    }) as ReactNode[]
}

export default reactTemplater


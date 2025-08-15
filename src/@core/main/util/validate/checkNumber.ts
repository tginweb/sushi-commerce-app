import {TValidatorNumber} from "@core/main/types";
import {toNumber} from "lodash";

export default function checkNumber(val: string, params: Omit<TValidatorNumber, 'type'> = {}) {
    const _val = toNumber(val)

    if (params.min && _val < params.min) {
        params.message = params.message || 'минимальное значение ' + params.min
        return false
    }
    if (params.max && _val > params.max) {
        params.message = params.message || 'максимальное значение ' + params.max
        return false
    }
    return true
}

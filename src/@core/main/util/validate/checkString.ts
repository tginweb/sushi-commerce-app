import {TValidatorString} from "@core/main/types";

export default function checkString(val: string, params: Omit<TValidatorString, 'type'> = {}) {

    const _val = val || ''

    if (params.min && _val.length < params.min) {
        params.message = params.message || 'минимальная длина ' + params.min
        return false
    }

    if (params.max && _val.length > params.max) {
        params.message = params.message || 'максимальная длина ' + params.max
        return false
    }

    if (params.regexp && _val.match(new RegExp(params.regexp))) {
        params.message = params.message || 'неверный формат'
        return false
    }

    return true
}

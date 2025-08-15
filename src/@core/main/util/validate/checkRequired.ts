import {TValidatorRequired} from "@core/main/types";

export default function checkRequired(val: any, params: Omit<TValidatorRequired, 'type'> = {}) {
    const _val = !!val
    if (!_val) {
        params.message = params.message || 'обязательное поле'
        return false
    }
    return true
}

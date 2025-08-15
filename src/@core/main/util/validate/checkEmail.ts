import {TNullable, TValidatorEmail} from "@core/main/types";

export default function checkEmail(val: TNullable<string>, params: Omit<TValidatorEmail, 'type'> = {}) {
    const _val = val || ''
    params.message = params.message || 'неверный формат email'
    return !!_val.match(/\S+@\S+\.\S+/)
}

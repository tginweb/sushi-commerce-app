import {TNullable, TValidatorPhone} from "@core/main/types";
export default function checkPhone(val: TNullable<string>, params: Omit<TValidatorPhone, 'type'> = {}) {
    const _val = val || ''
    const _valNumeric = _val.replace(/[^\d]/g, '')
    params.message = params.message || 'неверный формат'
    return !!_valNumeric.match(/^((\+7|7|8)[0-9]{10}|[^78][0-9]{9})$/)
}

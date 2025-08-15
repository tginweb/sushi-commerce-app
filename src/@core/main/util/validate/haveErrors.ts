import {TMaybe, TValidateErrors, TValidateResult} from "@core/main/types";

export default function haveErrors(data: TMaybe<TValidateErrors | TValidateResult | boolean>): boolean {
    if (data) {
        if (data === true) {
            return false
        } else if (Array.isArray(data)) {
            return data.length > 0
        } else {
            return true
        }
    } else {
        return false
    }
}

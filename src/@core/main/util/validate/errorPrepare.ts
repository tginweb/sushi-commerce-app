import {TMessage, TValidateError, TValidateRuleResult} from "@core/main/types";

export default function errorPrepare(data: TValidateError | TValidateRuleResult): TValidateError | null {

    let error: TValidateError

    if (data) {

        error = {
            type: 'error',
        }

        if (typeof data === 'string') {
            error.message = data
        } else if (typeof data === 'object') {
            error = {
                ...error,
                ...data
            }
        } else {
            error.message = 'Ошибка'
        }

        return error
    }

    return null
}

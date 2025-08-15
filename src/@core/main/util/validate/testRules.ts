import {TValidateErrors, TValidateMode, TValidateResult, TValidateRules} from "@core/main/types";
import errorPrepare from "./errorPrepare";
import validate from "@core/main/util/validate/validate";

export default function testRules(mode: TValidateMode, rules: TValidateRules, value?: any, errorsCollector?: TValidateErrors | null, ctx?: any): TValidateResult {

    const localErrors: TValidateErrors = []

    for (const rule of rules) {

        let res

        if (typeof rule === 'function') {
            res = rule(value, ctx)
        } else if (typeof rule === 'object') {
            const _rule = {...rule}
            res = validate(value, _rule)
            if (!res && _rule.message) {
                res = _rule.message
            }
        }

        if (res !== true) {
            let error = errorPrepare(res)
            if (error) {
                localErrors.push(error)
                if (mode === 'first') {
                    break
                }
            }
        }
    }
    if (localErrors.length) {
        if (errorsCollector) {
            Array.prototype.push.apply(errorsCollector, localErrors)
        }
        return localErrors
    }
    return true
}

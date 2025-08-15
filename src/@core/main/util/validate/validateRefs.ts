import {
    TValidatableComponentHandle,
    TValidateError,
    TValidateErrors,
    TValidateMode,
    TValidateResult
} from "@core/main/types";

export function validateResultArray(res?: boolean | TValidateResult): TValidateErrors {
    return !Array.isArray(res) ? [] : res
}

export function validateRefsArray(
    _refs: any,
    modeRoot: TValidateMode = 'all',
    modeChilds: TValidateMode = 'first',
    collector?: TValidateErrors,
): TValidateErrors {
    const res = validateRefs(_refs, modeRoot, modeChilds, collector)
    return !res || res === true ? [] : res
}

export function validateRefs(
    _refs: any,
    modeRoot: TValidateMode = 'all',
    modeChilds: TValidateMode = 'first',
    collector?: TValidateErrors,
): TValidateResult {

    const errors: TValidateErrors = []

    for (const [refKey, ref] of Object.entries(_refs)) {

        // @ts-ignore
        const refValue = ref?.current

        if (refValue) {

            const refMethods: TValidatableComponentHandle = refValue

            if (!refMethods.validate)
                continue;

            const res = refMethods.validate(modeChilds)

            if (Array.isArray(res) && res.length) {

                res.forEach((error: TValidateError) => {
                    if (typeof error === 'object') {
                        error.code = refKey
                    }
                    errors.push(error)
                })

                if (collector) {
                    Array.prototype.push.apply(collector, res)
                }

                if (modeRoot === 'first') {
                    break
                }
            }
        }
    }

    return errors.length ? errors : true
}

export default validateRefs

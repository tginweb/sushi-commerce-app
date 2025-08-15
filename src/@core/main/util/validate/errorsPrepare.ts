import {TValidateErrors} from "@core/main/types";
import errorPrepare from "@core/main/util/validate/errorPrepare";

export default function errorsPrepare(data: TValidateErrors): TValidateErrors {
    const res = []
    for (const item of data) {
        const error = errorPrepare(item)
        if (error) {
            res.push(error)
        }
    }
    return res
}

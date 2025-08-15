import {TCommonDialogProps} from "@core/main/types";
import {CaptchaInput, CaptchaModel} from "~gql/api";

export type TCaptchaDialogProps = TCommonDialogProps & {
    model: CaptchaModel
    //onSuccess?: (data: CaptchaInput) => void
}

export type TCaptchaCommandReload = {
    type: 'reload'
    param: string
}

export type TCaptchaCommandApply = {
    type: 'apply',
    sid: string
}

export type TCaptchaCommand = TCaptchaCommandReload | TCaptchaCommandApply

export type TCaptchaEventSuccess = {
    type: 'success'
    data: CaptchaInput
}

export type TCaptchaEventError = {
    type: 'error'
}

export type TCaptchaEvent = TCaptchaEventSuccess | TCaptchaEventError

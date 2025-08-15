import {CaptchaInput, CaptchaModel} from "~gql/api";

export type UiCaptchaDialogProps = {
    model: CaptchaModel
    onSuccess?: (data: CaptchaInput) => void
}

export type TCommandReload = {
    type: 'reload'
    param: string
}

export type TCommandApply = {
    type: 'apply',
    sid: string
}

export type TCommand = TCommandReload | TCommandApply

export type TCaptchaEventSuccess = {
    type: 'success'
    data: CaptchaInput
}

export type TCaptchaEventError = {
    type: 'error'
}

export type TCaptchaEvent = TCaptchaEventSuccess | TCaptchaEventError

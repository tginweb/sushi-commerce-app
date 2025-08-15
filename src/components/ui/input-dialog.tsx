import React, {PropsWithChildren, useCallback, useState} from "react"
import {StyleSheet} from "react-native"
import {UiDialog, UiDialogProps} from "~ui/dialog";
import {UiTextField, UiTextFieldProps} from "~ui/text-field";

export type UiInputDialogProps = UiDialogProps & {
    inputProps: UiTextFieldProps
    onApply?: (val: string, close?: () => void) => void
}

export const UiInputDialog: React.FC<PropsWithChildren<UiInputDialogProps>> = (props) => {

    const {
        inputProps = {},
        actions,
        onApply,
        onSuccess,
        ...rest
    } = props

    const {
        value,
    } = inputProps

    const [textState, setTextState] = useState<string>(value || '')

    const _onSuccess = useCallback(() => {
        onSuccess && onSuccess()
        onApply && onApply(textState)
    }, [onApply, onSuccess, textState])

    return (
        <UiDialog
            {...rest}
            actionSuccess={true}
            actionCancel={true}
            onSuccess={_onSuccess}
        >
            <UiTextField
                {...inputProps}
                value={textState}
                onChangeText={(v) => {
                    setTextState(v)
                }}
            />
        </UiDialog>
    )
}

export default UiInputDialog

const styles = StyleSheet.create({})

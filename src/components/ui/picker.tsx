import {Picker, PickerProps, Text, View} from "react-native-ui-lib"
import React, {useEffect, useImperativeHandle, useState} from "react"
import {StyleSheet} from "react-native"
import {TValidatableComponentHandle, TValidateErrors, TValidateResult, TValidateRules} from "@core/main/types";
import testRules from "@core/main/util/validate/testRules";
import {useWatch} from "@core/main/lib/hooks/useWatch";

export type UiPickerProps = PickerProps & {
    rules?: TValidateRules
    validateOnStart?: boolean
}

export type UiPickerPublicMethods = TValidatableComponentHandle & {}

const UiPickerComponent: React.FC<UiPickerProps> = (props, ref) => {

    const {
        value,
        rules,
        onChange,
        validateOnStart,
        ...rest
    } = props

    const inputRef = React.useRef<any>()

    const [valueState, setValueState] = useState<any>(value)
    const [valueChanged, setValueChanged] = useState(false)

    const [needValidate, setNeedValidate] = useState(false)
    const [validateCalled, setValidateCalled] = useState(false)
    const [haveError, setHaveError] = useState(false)
    const [errorMessages, setErrorMessages] = useState<TValidateErrors | null>(null)

    useImperativeHandle<any, UiPickerPublicMethods>(ref, () => ({
        ...inputRef.current,
        validate: methods.validate,
        validateReset: methods.validateReset,
    }))

    useEffect(() => {
        
        if (validateOnStart) {
            setNeedValidate(true)
        }
    }, [])

    useWatch(() => {
        setValueState(value)
        if (validateCalled) {
            setNeedValidate(true)
        }
    }, [value])

    useEffect(() => {
        
        if (needValidate) {
            methods.validate()
            setNeedValidate(false)
        }
    }, [needValidate])

    const methods = {
        validate: (): TValidateResult => {
            let res: TValidateResult = true
            if (rules && rules.length) {
                res = testRules('first', rules, valueState)
                if (res === true) {
                    setHaveError(false)
                    setErrorMessages(null)
                } else {
                    setHaveError(true)
                    setErrorMessages(res)
                }
            }
            setValidateCalled(true)
            return res
        },
        validateReset: () => {
            setNeedValidate(false)
            setValidateCalled(false)
        },
        onChangeValue: (v: any) => {
            if (valueState === v)
                return;
            setNeedValidate(true)
            setValueState(v)
            onChange && onChange(v)
            setValueChanged(true)
        },
    }

    return <>
        <Picker
            {...rest}
            onChange={methods.onChangeValue}
            value={valueState}
        />
        {haveError && Array.isArray(errorMessages) && (
            <View style={[styles.errorView]}>
                {errorMessages.map((message, index) => (
                    <View key={index} style={styles.errorItem}>
                        <Text text-sm-lh1 style={styles.errorItemText}>{message.message}</Text>
                    </View>
                ))}
            </View>
        )}
    </>
}

//@ts-ignore
export const UiPicker = React.forwardRef<UiPickerPublicMethods, UiPickerProps>(UiPickerComponent)

const styles = StyleSheet.create({
    errorView: {
        marginTop: 4,
        backgroundColor: '#FFFFFF',
        gap: 10
    },
    errorItem: {},
    errorItemText: {
        color: '#AA0000'
    }
})

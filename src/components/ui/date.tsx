import {DateTimePicker,  DateTimePickerProps, Text, View} from "react-native-ui-lib"
import React, {useEffect, useImperativeHandle, useState} from "react"
import {StyleSheet} from "react-native"
import {
    TValidatableComponentHandle,
    TValidateErrors,
    TValidateMode,
    TValidateResult,
    TValidateRules
} from "@core/main/types";
import testRules from "@core/main/util/validate/testRules";
import {useWatch} from "@core/main/lib/hooks/useWatch";
import dayjs from "dayjs";
import parseTime from "@core/main/util/date/parseTime";

export type UiDateProps = Omit<DateTimePickerProps, 'value'> & {
    value?: string | null
    rules?: TValidateRules
    validateOnStart?: boolean
    format?: string
    onChangeText?: (dateFormatted: string) => void
}

export type UiDatePublicMethods = TValidatableComponentHandle & {}

const UiDateComponent: React.FC<UiDateProps> = (props, ref) => {

    const {
        value,
        rules,
        onChange,
        validateOnStart,
        onChangeText,
        format = 'DD.MM.YYYY',
        ...rest
    } = props

    const inputRef = React.useRef<any>()

    const [valueState, setValueState] = useState<any>(() => {
        return value
    })

    const [needValidate, setNeedValidate] = useState(false)
    const [validateCalled, setValidateCalled] = useState(false)
    const [haveError, setHaveError] = useState(false)
    const [errorMessages, setErrorMessages] = useState<TValidateErrors | null>(null)

    useImperativeHandle<any, UiDatePublicMethods>(ref, () => ({
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
        validate: (mode?: TValidateMode): TValidateResult => {
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
        onChangeValue: (value: Date) => {
            onChange && onChange(value)
            const valueFormatted = dayjs(value).format(format)
            if (valueState === valueFormatted)
                return;
            setNeedValidate(true)
            setValueState(valueFormatted)
            onChangeText && onChangeText(valueFormatted)
        },
    }

    return <>
        <DateTimePicker
            {...rest}
            value={parseTime(valueState, format, 'jsdate')}
            onChange={methods.onChangeValue}
            locale={'ru-RU'}
            is24Hour={false}
            dateTimeFormatter={(v) => dayjs(v).format(format)}
        />
        {haveError && Array.isArray(errorMessages) && (
            <View style={[styles.errorView]}>
                {errorMessages.map((message, index) => (
                    <View key={index} style={styles.errorItem}>
                        <Text text-sm-lh1 style={styles.errorItemText}>{message.message} </Text>
                    </View>
                ))}
            </View>
        )}
    </>
}

//@ts-ignore
export const UiDate = React.forwardRef<UiDatePublicMethods, UiDateProps>(UiDateComponent)

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

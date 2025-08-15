import {Text, View, DateTimePicker} from "react-native-ui-lib"
import React, {useCallback, useMemo, useState} from "react"
import {StyleSheet} from "react-native"
import dayjs, {Dayjs} from "dayjs";
import {UiDatePublicMethods} from "~ui/date";
import {UiBtnProps} from "~ui/btn";
import {TBottomSheetScopeProps, UiBottomSheet, useBottomSheetScope} from "~ui/bottom-sheet";
import  {DateTimePickerEvent} from "@react-native-community/datetimepicker";
import parseTime from "@core/main/util/date/parseTime";
import {TValidateErrors, TValidateResult, TValidateRules} from "@core/main/types";
import testRules from "@core/main/util/validate/testRules";
import {useWatch} from "@core/main/lib/hooks/useWatch";

export type UiDateDialogProps = TBottomSheetScopeProps & {
    rules?: TValidateRules
    dateValue?: string | number | null,
    onDone: (date) => void,
    onChange: (date) => void,
}

export type UiDateDialogPublicMethods = UiDatePublicMethods & {}

const UiDateDialogComponent: React.FC<UiDateDialogProps> = (props, ref) => {

    const {
        dateValue,
        onChange,
        onDone,
        onClose,
        rules,
        ...dialogProps
    } = props

    const dialog = useBottomSheetScope(dialogProps)

    const [valueState, setValueState] = useState<Dayjs>(() => {
        return dateValue ? parseTime(dateValue, 'date', 'dayjs') : dayjs(new Date())
    })

    const [errorMessages, setErrorMessages] = useState<TValidateErrors>([])

    const footerActions = useMemo(() => {

        const res: UiBtnProps[] = []

        res.push({
            label: 'Готово',
            disabled: !!errorMessages.length,
            onPress: () => {
                onDone && onDone(valueState)
                onClose && onClose()
            }
        })

        return res
    }, [valueState, errorMessages, onDone])

    const validate = useCallback((): TValidateResult => {

        let res: TValidateResult = true
        if (rules && rules.length) {
            res = testRules('first', rules, valueState)
            if (res === true) {
                setErrorMessages([])
            } else {
                setErrorMessages(res)
            }
        }
        return res
    }, [valueState])

    const onDateChange = useCallback((e: DateTimePickerEvent) => {
        const {
            nativeEvent: {timestamp, utcOffset},
        } = e
        const date = dayjs(new Date(timestamp))
        setValueState(date)
    }, [validate])

    useWatch(() => {
        if (validate() === true) {
            const dateFormatted = valueState.format('DD.MM.YYYY')
            onChange && onChange(dateFormatted)
        }
    }, [valueState])

    return <UiBottomSheet
        id={'profile-edit'}
        isVisible={dialog.visible}
        autoHeight={true}
        onClose={() => {
            dialog.hide()
            onClose && onClose()
        }}
        preset={'default'}
        title={dialogProps.title || 'Выбор даты'}
        footerActions={footerActions}
        //footerDynamic={true}
    >
        <View marginV-modalV gap-12>
            <DateTimePicker
                mode={'date'}
                display={'spinner'}
                value={valueState.toDate()}
                locale={'ru-RU'}
                onChange={onDateChange}

            />
            {!!errorMessages.length && <View style={[styles.errorView]}>
                {errorMessages.map((message, index) => (
                    <View key={index} style={styles.errorItem}>
                        <Text text-sm-lh1 style={styles.errorItemText}>{message.message} </Text>
                    </View>
                ))}
            </View>}
        </View>
    </UiBottomSheet>
}

//@ts-ignore
export const UiDateDialog = React.forwardRef<UiDateDialogPublicMethods, UiDateDialogProps>(UiDateDialogComponent)

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

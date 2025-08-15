import React, {useMemo, useRef, useState} from "react"
import {StyleSheet} from "react-native"
import {observer} from "mobx-react"
import {useStores} from "~stores"
import {UiBottomSheet} from "~com/ui/bottom-sheet";
import {View} from "react-native-ui-lib";
import {parseTime, timestampToFormat} from "@core/main/util/date";
import {UiBtnProps} from "~ui/btn";
import {UiTimeView} from "~ui/time-view";
import {DateTimePickerEvent} from '@react-native-community/datetimepicker';
import dayjs from "dayjs";
import {UiMessages} from "~ui/messages";
import {UiMessage} from "~ui/message";
import {COLORS, TYPOGRAPHY} from "~assets/design";
import icons from "~assets/icons-map";
import SaleConfig from "@core/sale/config";
import {UiSegments} from "~ui/segments";
import haveErrors from "@core/main/util/validate/haveErrors";
import {TMessages} from "@core/main/types";
import {DateTimePicker} from "~ui/dateTimePicker";
import {useDebounceCallback} from "@core/main/lib/hooks/useDebounceCallback";

export const VorderTimeDialog: React.FC = observer(() => {

    const refs = {
        sheet: useRef<any>(null),
    }

    const {vorder} = useStores()

    const [timeSelected, setTimeSelected] = useState<boolean>(false)

    const mode = vorder.attrValue['TIME_MODE']

    const now = dayjs()

    const datetime = vorder.attrValue['DATE'] && vorder.attrValue['TIME'] ? dayjs(vorder.attrValue['DATE'] + ' ' + vorder.attrValue['TIME'], 'DD.MM.YYYY HH:mm') : dayjs()

    const DATE = datetime.format('DD.MM.YYYY')
    const TIME = datetime.format('HH:mm')

    const datetimeStr = (() => {
        if (DATE && TIME) {
            return [DATE, TIME].join(' ')
        }
    })()

    // COMPUTED

    let timeDate = (() => {
        return datetimeStr && vorder.attrValue['TIME'] ? parseTime(datetimeStr, 'datetime', 'jsdate') : null
    })()

    let dateDate = (() => {
        return DATE ? parseTime(DATE, 'date', 'jsdate') : null
    })()

    const loading = vorder.apiMutateReserve.pending
    const loadingLabel = 'идет проверка'
    const reserveResult = vorder.deliveryRequest.result

    const modeOptions = useMemo<any>(() => {
        return [
            {label: 'На ближайшее', value: 'nearest', loading: loading && vorder.attrValue['TIME_MODE'] === 'nearest'},
            {
                label: 'На выбранное время',
                value: 'custom',
                loading: loading && vorder.attrValue['TIME_MODE'] === 'custom'
            },
        ]
    }, [loading])

    const dialogActions = useMemo<UiBtnProps[]>(() => {

        const res: UiBtnProps[] = []

        if (timeSelected && vorder.deliveryTimeSelectedAndActual) {
            res.push({
                label: 'Готово',
                onPress: () => {
                    refs.sheet.current.closeModal()
                }
            })
        } else {

            if (mode === 'nearest') {

                res.push({
                    label: 'Проверить ближайшее время',
                    onPress: async () => {
                        if (await vorder.deliveryRequestReserve())
                            setTimeSelected(true)
                    },
                    loading: vorder.apiMutateReserve.pending,
                    loadingLabel: loadingLabel
                })

            } else {
                if (reserveResult.status === 'time_busy' && reserveResult.timeAvailable) {
                    res.push({
                        label: 'Выбрать ближайшее ' + timestampToFormat(reserveResult.timeAvailable, 'DD MMM HH:mm'),
                        icon: icons.check,
                        onPress: () => onSuggestedTimeSelect(reserveResult.timeAvailable),
                    })
                    res.push({
                        label: 'Проверить заново',
                        onPress: async () => {
                            if (await vorder.deliveryRequestReserve())
                                setTimeSelected(true)
                        },
                        loading: loading,
                        loadingLabel: loadingLabel,
                        link: true,
                    })
                } else {
                    res.push({
                        label: 'Проверить выбранное время',
                        onPress: async () => {
                            if (await vorder.deliveryRequestReserve())
                                setTimeSelected(true)
                        },
                        loading: loading,
                        loadingLabel: loadingLabel,
                        disabled: !vorder.attrValue['TIME']
                    })
                }
            }
        }

        return res
    }, [
        mode,
        loading,
        vorder.deliveryTimeSelectedAndActual,
        reserveResult.status,
        reserveResult.timeAvailable,
        timeSelected,
        vorder.attrValue['TIME']
    ])

    // METHODS

    const onSuggestedTimeSelect = (time: any) => {
        vorder.setCustomTime(time)
        setTimeSelected(true)
    }

    const onShow = () => {
        setTimeSelected(false)
    }

    const findNearest = useDebounceCallback(async () => {
        if (await vorder.deliveryRequestReserve())
            setTimeSelected(true)
    }, 1000)

    const onModeChange = async (value: string) => {
        vorder.setPropValue('TIME_MODE', value)
        setTimeSelected(false)
        if (value === 'nearest') {
            findNearest()
        }
    }

    const onChangeDateTime = async (part: 'date' | 'time', e: DateTimePickerEvent | Date) => {

        let time: Date

        if (e instanceof Date) {
            time = e
        } else {
            const {
                type,
                nativeEvent: {timestamp, utcOffset},
            } = e
            if (type !== 'set') {
                return;
            }
            time = new Date(timestamp)
        }

        let reserve

        if (part === 'date') {
            const newDate = dayjs(time).format('DD.MM.YYYY')

            if (newDate !== vorder.attrValue['DATE']) {
                vorder.setPropValue('DATE', newDate)
                vorder.setPropValue('TIME', '')
            }
            reserve = false
        } else {
            vorder.setPropValue('TIME', dayjs(time).format('HH:mm'))
            reserve = true
        }

        vorder.deliveryReserveReset()

        setTimeSelected(false)

        if (reserve) {
            if (await vorder.deliveryRequestReserve())
                setTimeSelected(true)
        }
    }

    const renderResult = () => <View>
        {
            haveErrors(vorder.validateResult.time) ?
                <UiMessages
                    items={vorder.validateResult.time as TMessages}
                    preset={['flat', 'dense', 'center']}
                    gap-10
                />
                :
                <UiMessage
                    preset={['flat', 'dense', 'center']}
                    message={{
                        title: 'Время свободно',
                        type: 'success'
                    }}
                />
        }
    </View>

    const minimumDate = vorder.isTransportCourier ?
        now.add(SaleConfig.SALE_RESERVE_MIN_TIME_COURIER, 'minute') :
        now.add(SaleConfig.SALE_RESERVE_MIN_TIME_PICKUP, 'minute')

    return (
        <UiBottomSheet
            id={'time'}
            ref={refs.sheet}
            isVisible={vorder.dialogs.time.visible}
            title={'Время ' + vorder.getTransportTypeName(true)}
            onClose={() => vorder.vorderDialogClose('time')}
            preset={'default'}
            autoHeight={true}
            bodyScrollable={false}
            stackBehavior={'push'}
            footerActions={dialogActions}
            //onBeforeClose={onBeforeClose}
        >
            <View marginV-30>

                <View paddingH-5>
                    <UiSegments
                        initialValue={vorder.attrValue['TIME_MODE']}
                        segments={modeOptions}
                        activeColor={COLORS.primary}
                        onChangeValue={onModeChange}
                        readonly={loading}
                    />
                </View>

                <View marginT-15>
                    {mode === 'nearest' ?

                        <View marginT-20 style={{gap: 20}}>

                            <View centerH>
                                <UiTimeView
                                    value={vorder.deliveryTimeDayjs}
                                    valueFormat={'object'}
                                    placeholder={'время не выбрано'}
                                    textStyle={{
                                        ...TYPOGRAPHY['text-xxl']
                                    }}
                                />
                            </View>

                            {!vorder.apiMutateReserve.pending && renderResult()}

                        </View>
                        :
                        <View marginT-20 style={{gap: 20}}>

                            <View row centerH gap-10 pointerEvents={loading ? 'none' : 'auto'}>
                                <View>
                                    <DateTimePicker
                                        minimumDate={minimumDate.toDate()}
                                        value={dateDate}
                                        placeholder={'выбрать дату'}
                                        mode={'date'}
                                        is24Hour={true}
                                        locale={'ru-RU'}
                                        onChange={(e) => onChangeDateTime('date', e)}
                                        dateTimeFormatter={(d) => dayjs(d).format('DD.MM.YYYY')}
                                        style={styles.field}
                                        dialogProps={{}}
                                    />
                                </View>
                                <View>
                                    <DateTimePicker
                                        minimumDate={minimumDate.toDate()}
                                        value={timeDate}
                                        placeholder={'выбрать время'}
                                        mode={'time'}
                                        is24Hour={true}
                                        locale={'ru-RU'}
                                        onChange={(e) => onChangeDateTime('time', e)}
                                        dateTimeFormatter={(d) => dayjs(d).format('HH:mm')}
                                        display={'spinner'}
                                        style={styles.field}
                                    />
                                </View>
                            </View>

                            {!vorder.apiMutateReserve.pending && renderResult()}

                        </View>
                    }
                </View>
            </View>

        </UiBottomSheet>
    )
})

export default VorderTimeDialog

const styles = StyleSheet.create({
    field: {
        ...TYPOGRAPHY['text-xl'],
        borderWidth: 1,
        borderRadius: 12,
        paddingVertical: 7,
        paddingHorizontal: 10,
        borderColor: COLORS.grey60,
        backgroundColor: COLORS.grey80
    },
    fieldEmpty: {
        fontSize: 12,
        height: 20
    }
})

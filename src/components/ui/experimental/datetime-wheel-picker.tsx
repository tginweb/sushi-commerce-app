import _ from 'lodash';
import React, {useCallback, useMemo, useState} from 'react';
import {StyleSheet} from 'react-native';
import {Colors, SectionsWheelPicker, View, WheelPicker, WheelPickerProps} from 'react-native-ui-lib';
import dayjs from "dayjs";

type TItem = {
    label: string
    value: string
}

export type TDatetimeWheelPickerProps = {
    days?: TItem[]
    daysLimit?: number
    fromDate?: any
}

export const DatetimeWheelPicker: React.FC<TDatetimeWheelPickerProps> = (props) => {

    const {
        days,
        daysLimit = 7,
        fromDate
    } = props

    const _fromDate = dayjs(fromDate)

    const [selectedDay, setSelectedDay] = useState(_fromDate.format('DD.MM.YYYY'))
    const [selectedHour, setSelectedHour] = useState(_fromDate.hour())
    const [selectedMinute, setSelectedMinute] = useState(_fromDate.minute())

    const dates = useMemo(() => {

        if (days)
            return days

        const res = [];

        if (daysLimit) {
            for (let i = 0; i < daysLimit; i++) {
                const day = _fromDate.clone().add(i, 'day')
                res.push({
                    'label': day.format('DD.MM.YYYY'),
                    'value': day.format('DD.MM.YYYY')
                })
            }
        }

        return res
    }, [days, daysLimit]);

    const hours = useMemo<TItem[]>(() => {
        return _.times(24, i => i).reduce<TItem[]>((acc, hour) => {
            const d = dayjs(selectedDay + ' ' + hour + ':59' , 'DD.MM.YYYY HH:mm')

            // @ts-ignore
            //console.log(_fromDate.format('DD.MM.YYYY HH:mm'), 'ss')
            if (d.isSameOrAfter(_fromDate)) {

                acc.push({
                    label: hour.toString(),
                    value: hour.toString()
                })
            }
            return acc
        }, [])
    }, [selectedDay])

    const minutes = useMemo<TItem[]>(() => {
        return _.times(60, i => i).reduce<TItem[]>((acc, minute) => {
            const d = dayjs(selectedDay + ' ' + selectedHour + ':' + minute, 'DD.MM.YYYY HH:m')
            // @ts-ignore
            if (d.isSameOrAfter(_fromDate)) {
                //console.log(d.format('DD.MM.YYYY HH:m'))
                acc.push({
                    label: minute.toString(),
                    value: minute.toString()
                })
            }
            return acc
        }, [])
    }, [selectedDay, selectedHour])

    const onDayChange = useCallback((item: number | string) => {
        setSelectedDay(item as number);
    }, []);


    const onHourChange = useCallback((item: number | string) => {
        setSelectedHour(item as number);
    }, []);

    const onMinuteChange = useCallback((item: number | string) => {
        setSelectedMinute(item as number);
    }, []);

    const onSavePress = useCallback(() => {
        const days = selectedDay === 1 ? 'day' : 'days';
        const hours = selectedHour === 1 ? 'hour' : 'hours';
        const minutes = selectedMinute === 1 ? 'minute' : 'minutes';

    }, [selectedDay, selectedHour, selectedMinute]);

    const onResetPress = useCallback(() => {
        setSelectedDay(0);
        setSelectedHour(0);
        setSelectedMinute(0);
    }, []);

    //console.log(getItems(DAYS))

    const sections: WheelPickerProps[] = useMemo(() => {
        return [
            {
                items: dates,
                onChange: onDayChange,
                initialValue: selectedDay,
                align: WheelPicker.alignments.LEFT,
                style: {
                    flex: 1,
                    minWidth: 100
                },
                flatListProps: {
                    nestedScrollEnabled: true
                }
            },
            {
                items: hours,
                onChange: onHourChange,
                initialValue: selectedHour,
                label: 'час',
                align: WheelPicker.alignments.LEFT,
                style: {
                    flex: 1,
                    //minWidth: 100
                },
                flatListProps: {
                    nestedScrollEnabled: true
                }
            },
            {
                items: minutes,
                onChange: onMinuteChange,
                initialValue: selectedMinute,
                label: 'мин',
                align: WheelPicker.alignments.LEFT,
                style: {
                    flex: 1,
                    //minWidth: 100
                },
                flatListProps: {
                    nestedScrollEnabled: true
                }
            }
        ];
    }, [
        selectedDay,
        selectedHour,
        selectedMinute,
        onDayChange,
        onHourChange,
        onMinuteChange,
    ])

    return (
        <View>
            <SectionsWheelPicker
                numberOfVisibleRows={4}
                sections={sections}
            />
        </View>
    );
}

export default DatetimeWheelPicker

const styles = StyleSheet.create({
    bottomDivider: {
        borderBottomColor: Colors.$outlineDefault,
        borderBottomWidth: 4
    }
});

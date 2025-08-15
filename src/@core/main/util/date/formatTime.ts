import parseTime from "@core/main/util/date/parseTime";

export type TFormatTimeProps = {

    splitter?: string

    dateFormat?: string
    dateTodayName?: boolean
    dateTomorrowName?: boolean

    timeFormat?: string

    value?: any
    valueFormat?: string

    valueDate?: any
    valueDateFormat?: string

    valueTime?: any
    valueTimeFormat?: string
}

export function formatTime(props: TFormatTimeProps) {

    const {
        splitter = '',
        value = null,
        valueDate,
        valueTime,
        valueFormat = 'DD.MM.YYYY HH:mm',
        valueTimeFormat = 'HH:mm',
        valueDateFormat = 'DD.MM.YYYY',
        timeFormat = 'HH:mm',
        dateTomorrowName = true,
        dateTodayName = true,
        dateFormat = 'DD MMMM',
    } = props

    const valueComp = (() => {
        if (value) {
            return parseTime(value, valueFormat, 'object')
        } else if (valueDate && valueTime) {
            return parseTime(valueDate + ' ' + valueTime, valueDateFormat + ' ' + valueTimeFormat, 'object')
        } else if (valueDate) {
            return parseTime(valueDate, valueDateFormat, 'object')
        } else if (valueTime) {
            return parseTime(valueTime, valueTimeFormat, 'object')
        }
    })()

    const dateFormatted = (() => {
        if (!valueComp)
            return;

        const v = valueComp

        if (dateTodayName && v.isToday()) {
            return 'сегодня'
        } else if (dateTomorrowName && v.isTomorrow()) {
            return 'завтра'
        } else {
            return v.format(dateFormat)
        }
    })()

    const timeFormatted = (() => {
        if (!valueComp)
            return;
        return valueComp.format(timeFormat)
    })()

    return {
        value: valueComp,
        dateFormatted,
        timeFormatted,
        datetimeFormatted: valueComp ? [dateFormatted, splitter, timeFormatted].filter(item => !!item).join(' ') : null
    }
}

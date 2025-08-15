import parseTime from "./parseTime"
import dayjs from "dayjs";
import {DurationUnitType} from "dayjs/esm/plugin/duration";
import plural from "plural-ru";

type TPart = {
    code: DurationUnitType
    label_lg: string[],
    label_md: string[],
    label_sm: string[],
}

const parts: TPart[] = [
    {
        code: 'day',
        label_lg: ['день', 'дня', 'дней',],
        label_md: ['день', 'дня', 'дней'],
        label_sm: ['д', 'д', 'д'],
    },
    {
        code: 'hour',
        label_lg: ['час', 'часа', 'часов'],
        label_md: ['час', 'час', 'час'],
        label_sm: ['ч', 'ч', 'ч'],
    },
    {
        code: 'minute',
        label_lg: ['минута', 'минуты', 'минут'],
        label_md: ['мин', 'мин', 'мин'],
        label_sm: ['м', 'м', 'м'],
    },
    {
        code: 'second',
        label_lg: ['секунда', 'секунды', 'секунд'],
        label_md: ['сек', 'сек', 'сек'],
        label_sm: ['с', 'с', 'с'],
    },
]

export default function duration(fromTs: any, toTs: any, toBound: DurationUnitType | null = null, size: 'lg' | 'md' | 'sm' | 'hide' = 'md') {
    const date1 = parseTime(fromTs, null, 'object')
    const date2 = parseTime(toTs, null, 'object')
    // @ts-ignore
    const duration = dayjs.duration(date1.diff(date2))

    const res: string[] = []

    for (const part of parts) {

        const partValue = Math.abs(duration.get(part.code))

        if (partValue && (partValue > 0)) {

            const labelKey = ('label_' + size) as keyof TPart

            const labels = part[labelKey] as string[]

            res.push(partValue + ' ' + plural(partValue, labels[0], labels[1], labels[2]))
        }

        if (toBound === part.code)
            break;
    }
    return res.join(' ')
}

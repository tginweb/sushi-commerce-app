const dayjs = require('dayjs')

export default function parseTime(val: any, formatInput: string | null, formatOutput: string = 'tms') {

    if (!val)
        return;

    switch (formatInput) {
        case 'datetime':
            formatInput = 'DD.MM.YYYY HH:mm'
            break
        case 'date':
            formatInput = 'DD.MM.YYYY'
            break
    }

    let t

    if (typeof val === 'string') {
        t = dayjs(val, formatInput, true)
    } else if (typeof val === 'number') {
        if (val < 2147483647) val = val * 1000
        t = dayjs(val)
    } else if (val instanceof Date) {
        t = dayjs(val)
    } else if (typeof val === 'object' && val.format) {
        t = val
    } else {
        return;
    }

    let res

    switch (formatOutput) {
        case 'ts':
            res = t.unix()
            res = !isNaN(res) ? res : null
            break
        case 'tms':
        case 'tsm':
            res = t.valueOf()
            res = !isNaN(res) ? res : null
            break
        case 'dayjs':
        case 'object':
            res = t
            break
        case 'jsdate':
            res = t.toDate()
            break
        default:
            res = t.format(formatOutput)
    }

    return res
}


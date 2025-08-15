import parseTime from "../date/parseTime"

export default function checkTime(val: string, format = 'date') {
    const res = parseTime('01.01.2020 ' + val, 'DD.MM.YYYY ' + format, 'tsm')
    return res && res > 0 ? true : false
}

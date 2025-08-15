const dayjs = require('dayjs')

export default function timestampToFormat(ts: any, format?: string) {

    ts = parseInt(ts)

    if (ts > 0) {

        if (ts < 2147483647) {
            ts = ts * 1000
        }

        switch (format) {
            case 'date':
                format = 'DD.MM.YYYY'
                break;
            case 'time':
                format = 'HH:mm'
                break;
            case 'datetime':
                format = 'DD.MM.YYYY HH:mm'
        }

        return dayjs(ts).format(format)
    }
}


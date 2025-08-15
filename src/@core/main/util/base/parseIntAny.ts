export default function parseIntAny(val: any, def = 0) {
    if (val) {
        if (typeof val === 'number') {
            return val
        } else if (typeof val === 'string') {
            return parseInt(val)
        } else {
            return def
        }
    } else {
        return def
    }
}

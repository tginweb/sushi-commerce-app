export function toInt(v?: string | number | boolean | null, def: number = 0) {
    if (v) {
        let num = 0
        if (typeof v === 'number') {
            num = v
        } else if (typeof v === 'string') {
            num = parseInt(v.toString())
        } else if (typeof v === 'boolean') {
            num = def
        }
        return !isNaN(num) ? num : def
    }
    return def
}

export default toInt

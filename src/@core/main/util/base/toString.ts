export function toString(v: any): string {
    if (typeof v === 'string')
        return v
    else if (v === 0)
        return '0'
    else if (v)
        return v.toString()
    else
        return ''
}

export default toString

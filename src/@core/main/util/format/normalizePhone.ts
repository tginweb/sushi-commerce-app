export default function normalizePhone(val: string | null | undefined, format: 'full-view' | 'to-call' = 'full-view') {

    let res: string

    const valNumeric = val ? val.replace(/[^\d]/g, '') : '' as string

    if (!valNumeric)
        return ''

    const changeToPlus7 = (v: string) => {
        const firstChar = valNumeric.charAt(0)
        if (firstChar === '8') {
            return '+7' + v.substring(1)
        } else if (firstChar === '9') {
            return '+7' + v.substring(1)
        } else if (firstChar === '7') {
            return '+' + v
        } else {
            return v
        }
    }

    switch (format) {
        case 'full-view':
            res = changeToPlus7(valNumeric)
            break
        case 'to-call':
            res = changeToPlus7(valNumeric)
            break
    }

    return res
}


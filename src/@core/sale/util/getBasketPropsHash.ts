export function getBasketPropsHash(data: any): string {
    const res = []

    for (const [key, val] of Object.entries(data || {})) {
        if (val) {
            if (Array.isArray(val)) {
                res.push(key + '=[' + getBasketPropsHash(val) + ']')
            } else if (typeof val === 'object') {
                if (Object.keys(val as any).length) {
                    res.push(key + '=[' + getBasketPropsHash(val) + ']')
                }
            } else {
                res.push(key + '=' + val)
            }
        }
    }
    return res.join(',')
}

export default getBasketPropsHash

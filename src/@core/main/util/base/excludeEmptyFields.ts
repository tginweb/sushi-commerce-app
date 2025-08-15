import isScalar from "@core/main/util/base/isScalar";

export function excludeEmptyFields<T>(data: T, recurse?: boolean) {
    if (typeof data === 'object' && Array.isArray(data)) {
        const res: any = []
        for (const val of data) {
            if (val) {
                res.push(excludeEmptyFields(val))
            }
        }
        return res as T
    } else if (typeof data === 'object') {
        const res: any = {}
        for (const [key, val] of Object.entries(data as any)) {
            if (val === null || val === undefined) {
                continue
            }
            if (isScalar(val)) {
                res[key] = val
            } else if (typeof val == "object") {
                res[key] = excludeEmptyFields(val)
            } else {
                res[key] = val
            }
        }
        return res as T
    } else {
        return data
    }
}

export default excludeEmptyFields

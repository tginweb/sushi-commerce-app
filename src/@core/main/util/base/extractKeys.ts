export function extractKeys<T>(object: any, keys: string[] = [], ignoreNull = false)  {
    const res: T | any = {}
    if (object) {
        for (const key of keys) {
            if ((object[key] !== undefined) && (!ignoreNull || object[key] !== null))
                res[key] = object[key]
        }
    }
    return res
}

export default extractKeys

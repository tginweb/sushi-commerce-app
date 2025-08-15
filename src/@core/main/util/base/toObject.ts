import isScalar from "@core/main/util/base/isScalar";

export function toObject(v: any, clone?: boolean) {
    if (isScalar(v) || !v) {
        return {}
    } else {
        return clone ? {...v} : v
    }
}

export default toObject

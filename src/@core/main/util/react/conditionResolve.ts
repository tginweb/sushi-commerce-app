import {TAppStores, TConditional} from "@core/main/types";
import toArray from "@core/main/util/base/toArray";
import getScopeData from "@core/main/util/react/getScopeData";
import toInt from "@core/main/util/base/toInt";
import {Condition} from "~gql/api";

export function conditionResolve(conditions: TConditional, scopes: any, stores: TAppStores): boolean {

    const _conditions = toArray<Condition>(conditions)

    for (const _cond of _conditions) {

        if (!_cond.path)
            continue;

        const value = getScopeData(_cond.path, scopes, stores) as any

        let res = true

        for (const condOp in _cond) {
            // @ts-ignore
            const condVal = _cond[condOp]

            if (condVal !== null) {
                switch (condOp) {
                    case 'eq':
                        res = res && (condVal === value)
                        break
                    case 'gt':
                        res = res && (condVal < toInt(value))
                        break
                    case 'lt':
                        res = res && (condVal > toInt(value))
                        break
                }
            }
        }

        if (res === false) {
            return false
        }
    }

    return true
}

export default getScopeData

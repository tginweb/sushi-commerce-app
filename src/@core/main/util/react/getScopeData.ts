import {TAppStores} from "@core/main/types";
import deepGet from "lodash/get";

export function getScopeData(path: string, vars: any = {}, stores: TAppStores) {
    const [scopeType, scopeName, scopePath] = path.split(':')
    let scope: any
    if (scopeType === 'store') {
        scope = stores[scopeName as keyof TAppStores]
        return deepGet(scope, scopePath)
    } else if (scopeType === 'var') {
        return deepGet(vars, scopeName)
    }
}

export default getScopeData

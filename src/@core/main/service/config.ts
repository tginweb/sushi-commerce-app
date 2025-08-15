import config from "~config"
import {TAppConfig} from "~modules/configs"
import CommonService from "@core/main/lib/service/common";

export type TConfigParamInfo = {
    className: string,
    classMember: string,
    writable?: boolean,
    server?: boolean,
    ns?: string,
}

export type TConfigParamInfoMap = Record<string, TConfigParamInfo>

export class ConfigService extends CommonService {

    config: any = {}
    paramsInfo: TConfigParamInfoMap = {}

    constructor() {
        super()
        this.config = config
    }

    boot() {
        this.booted = true
    }

    setParamInfo(memberName: string, info: TConfigParamInfo) {
        this.paramsInfo[memberName] = info
    }

    set(name: string, val: any): any {
        this.config[name] = val
    }

    get(name: string, def?: any): any {
        const res = this.config[name]
        return typeof res === 'undefined' ? def : res
    }

    setServerParams(serverParams: TAppConfig) {
        for (const [param, paramValue] of Object.entries(serverParams)) {
            const paramInfo = this.paramsInfo[param]
            if (paramInfo && paramInfo.server) {
                this.set(param, paramValue)
            }
        }
    }

    assign(params: any) {
        Object.assign(this.config, params)
    }
}

const service = new ConfigService()
export const configService = service
export default service

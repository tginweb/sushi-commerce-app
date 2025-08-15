import {MixedStyleRecord} from "@native-html/transient-render-engine";
import AppConfig from "@core/main/config";
import CommonService from "@core/main/lib/service/common";

export class HtmlService extends CommonService {

    constructor() {
        super()
    }

    getTagsStyles(scope: string | MixedStyleRecord = 'default'): MixedStyleRecord {
        if (typeof scope === 'object')
            return scope
        return AppConfig.HTML_STYLES[scope] || {}
    }

    getClassesStyles(scope: string | MixedStyleRecord = 'default'): MixedStyleRecord {
        if (typeof scope === 'object')
            return scope
        return AppConfig.HTML_CLASSES[scope] || {}
    }
}

export const service = new HtmlService()
export const htmlService = service
export default service



import normalizePhone from "@core/main/util/format/normalizePhone";
import * as Linking from "expo-linking";
import CommonService from "@core/main/lib/service/common";

export class LinkingService extends CommonService {
    callPhone(phone: string) {
        const phoneFormatted = normalizePhone(phone, 'to-call')
        try {
            Linking.openURL('tel:' + phoneFormatted);
        } catch (e) {
        }
    }
}

const service = new LinkingService()

export const linkingService = service

export default service

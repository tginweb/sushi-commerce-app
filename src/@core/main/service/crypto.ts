import configService from "@core/main/service/config";

import crypto from 'crypto-es'
import AppConfig from "@core/main/config";
import CommonService from "@core/main/lib/service/common";

export class CryptoService extends CommonService {

    constructor() {
        super()
    }

    getSalt() {
        let salt = configService.get('CRYPTO_SALT')
        const appSalt = AppConfig.APP_SALT
        if (appSalt) {
            salt = crypto.AES.decrypt(appSalt, salt).toString()
        }
        return salt
    }

    encodeData(data: any) {
        console.log('encodeData', data)
        const Buffer = require("buffer").Buffer
        const json = JSON.stringify(data)
        return new Buffer(json).toString("base64")
    }

    encrypt(data: any, base64: boolean = true) {
        const str = typeof data === 'string' ? data : JSON.stringify(data)

        let res = crypto.AES.encrypt(str, this.getSalt()).toString()
        if (base64) {
            const Buffer = require("buffer").Buffer;
            res = new Buffer(res).toString("base64");
        }
        return res
    }
}

export const service = new CryptoService()
export const cryptoService = service
export default service



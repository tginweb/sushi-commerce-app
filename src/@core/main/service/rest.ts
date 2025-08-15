import axios, {AxiosInstance} from "axios"
import AppConfig from "@core/main/config"
import CommonService from "@core/main/lib/service/common";

export class RestService extends CommonService {

    private client?: AxiosInstance;

    boot() {
        this.client = axios.create({
            baseURL: AppConfig.API_REST_URL,
            withCredentials: false,
            /*
            transformRequest1: (data, headers) => {
                const stores = require('~stores').default
                if (stores.user.sessionId) {
                    headers.Cookie = `PHPSESSID=${stores.user.sessionId}`
                }
                return data
            }
             */
        })
        this.booted = true
    }

    async request(method: string, url: string, getParams: object | null = {}, postParams: object | null = {}) {

        if (!this.client) return undefined

        const destUrl = url

        let res: any = {}

        switch (method) {
            case 'GET':
                res = await this.client.get(destUrl, {params: getParams})
                break;
            case 'POST':
                res = await this.client.post(destUrl, postParams, {params: getParams})
                break;
        }

        return res.data
    }

    async requestGet(url: string, params: object | null = {}) {
        return this.request('GET', url, params)
    }

    async requestPost(url: string, params: object | null = {}, getParams: object | null = {}) {
        return this.request('POST', url, getParams, params)
    }
}

const service = new RestService()
export const restService = service
export default service

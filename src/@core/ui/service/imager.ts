import {ImageURISource} from "react-native";
import {TMaybe} from "@core/main/types";
import debounce from "lodash/debounce";
import {Image} from "expo-image";
import AppConfig from "@core/main/config";
import {wHeight, wWidth} from "~assets/design";
import ImageSizes from "@core/ui/data/image-sizes";
import {TImageSize} from "@core/ui/types";
import CommonService from "@core/main/lib/service/common";

export class ImagerService extends CommonService {

    sizes = ImageSizes;
    params: any = {}

    imagesPrefetchRunQueueDebounced: any

    constructor() {
        super()
        this.imagesPrefetchRunQueueDebounced = debounce(this.imagesPrefetchRunQueue, 1000)
    }

    resolveSource(source: ImageURISource | null, style?: TImageSize): ImageURISource | undefined {
        if (source && source.uri) {
            return {
                ...source,
                uri: this.resolve(source.uri, style)
            }
        }
    }

    getStyleParams(style?: TImageSize): any {

        if (!style)
            return []

        let width, height, crop

        if (typeof style === 'string') {

            let matches = style.match(/([wh])\-(\d(\-\d)?)/)

            if (matches) {
                const sizeSide = matches[1]
                const sizeValue = matches[2]
                style = sizeSide === 'w' ?
                    [wWidth > 1000 ? 't' : 'm', sizeValue].join('-')
                    :
                    [wHeight > 1000 ? 't' : 'm', sizeValue].join('-')
            }
            let size = this.sizes[style]
            if (size) {
                [width, height] = size.args
                crop = size.op === 'crop'
            }
        } else if (typeof style === 'number') {
            width = style
            crop = false
        } else if (Array.isArray(style)) {
            [width, height, crop] = style
        } else {
            return []
        }

        const params: any = {}

        params.f = 'auto'
        params.c = crop ? 'thumb' : 'limit'

        if (width)
            params.w = width

        if (height)
            params.h = height

        const parts = [];

        for (let key in params) {
            parts.push(key + '_' + params[key])
        }

        return parts
    }

    resolve(url: TMaybe<string>, style?: TImageSize, isDev = false): string {

        if (!url)
            return ''

        if (isDev) {
            return AppConfig.IMAGE_DEV_BASE_URL + url
        }

        if (AppConfig.IMAGE_DEV_URLS && AppConfig.IMAGE_DEV_URLS.length) {
            for (const localUrl of AppConfig.IMAGE_DEV_URLS) {
                if (url.match(localUrl)) {
                    return AppConfig.IMAGE_DEV_BASE_URL + url
                }
            }
        }

        url = url.charAt(0) === '/' ? AppConfig.IMAGE_BASE_URL + url : url

        const params = this.getStyleParams(style).join(',')

        const template = AppConfig.IMAGE_STYLER_TEMPLATE

        let res: string

        if (params && template) {
            res = template.replace('#params#', params)
            res = res.replace('#imageUrl#', url)
            if (typeof style === 'string')
                res = res.replace('#style#', style)
        } else {
            res = url
        }

        return res;
    }

    imagePrefetchMap: Record<string, 'fetch' | 'fetching' | 'fetched'> = {}

    async imagesPrefetchRunQueue() {

        const map = this.imagePrefetchMap

        const urls = []

        for (const [url, status] of Object.entries(map)) {
            if (status === 'fetch') {
                map[url] = 'fetching'
                urls.push(url)
            }
        }

        if (urls.length) {
            await Image.prefetch(urls)
            urls.forEach((url, index) => {
                map[url] = 'fetched'
            })
        }
    }

    imagesPrefetch(urls: string[]) {
        const map = this.imagePrefetchMap
        for (const url of urls) {
            const curl = url
            if (!map[curl])
                map[curl] = 'fetch'
        }
        this.imagesPrefetchRunQueueDebounced()
    }
}

const service = new ImagerService()
export const imagerService = service
export default service

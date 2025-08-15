import {action, computed, makeObservable, observable} from "mobx"
import cleanText from "@core/main/util/react-native/cleanText"
import {Element, ElementProp, Image} from "~gql/api";
import {logComputed} from "@core/main/lib/mobx/log-computed";
import {Model} from "@core/main/model/Model";
import {imagerService} from "@core/ui/service/imager";

export class ElementModel extends Model {

    ID: number = 0
    IBLOCK_ID: number = 0
    IBLOCK_SECTION_ID: number = 0
    IBLOCK_SECTION_IDS: number[] = []
    NAME: string = ''
    CODE: string = ''
    SORT: number = 0
    DISCOUNT_ID?: number = 0
    PREVIEW_TEXT?: string = ''
    DETAIL_TEXT?: string = ''
    LIST_IMAGE?: Image
    DETAIL_IMAGE?: Image
    ACTIVE: boolean = true

    @observable
    PROPS: ElementProp[] = []

    @observable
    propValue: Record<string, any> = {}

    @observable
    prop: Record<string, ElementProp> = {}

    constructor(data?: Element | null, observer: boolean = true) {
        super()
        if (data) {
            Object.assign(this as any, data)
            this.indexProps(this.PROPS)
        }
        if (observer)
            makeObservable(this)
    }

    @action
    indexProps(props: ElementProp[]) {
        if (props) {
            for (let prop of props) {
                if (prop.CODE) {
                    this.prop[prop.CODE] = prop
                    this.propValue[prop.CODE] = prop.VAL
                }
            }
        }
    }

    @computed({keepAlive: true})
    get nameCleaned() {
        logComputed(this, 'nameCleaned')
        return this.NAME.trim()
    }

    @computed({keepAlive: true})
    get previewTextFormatted() {
        logComputed(this, 'previewTextFormatted')
        return cleanText(this.PREVIEW_TEXT)
    }

    get detailTextHtml() {
        return this.DETAIL_TEXT || this.PREVIEW_TEXT || ''
    }

    get detailImage() {
        return this.DETAIL_IMAGE || this.LIST_IMAGE
    }

    get listImage() {
        return this.LIST_IMAGE || this.DETAIL_IMAGE
    }

    getGallery() {

        let res: Image[] = []

        if (this.DETAIL_IMAGE) {
            res.push(this.DETAIL_IMAGE)
        }

        const prop = this.prop['PHOTOS'] || this.prop['GALLERY']

        if (prop && prop.FILES && prop.FILES.length) {
            res = [...res, ...prop.FILES]
        }

        return res
    }

    getImagePrefetchUrl() {
        return this.imageSrc
    }

    @computed({keepAlive: true})
    get imageSrc() {
        logComputed(this, 'imageSrc')
        const src = this.detailImage?.SRC
        return src ? imagerService.resolve(src, 630) : null
    }

    @computed({keepAlive: true})
    get imageSrcRequired() {
        return this.imageSrc || imagerService.resolve('/images/placeholder.png', 500)
    }

    @computed({keepAlive: true})
    get imageFullwidthSrcRequired() {
        return this.imageSrcRequired
    }
}


import {action, computed, makeObservable, observable} from "mobx";
import {ElementProp, Image, Section} from "~gql/api";
import {TCatalogMenuItem} from "@core/catalog/types";
import {logComputed} from "@core/main/lib/mobx/log-computed";
import {imagerService} from "@core/ui/service/imager";

export class SectionModel {
    ID: number = 0
    IBLOCK_SECTION_ID: number = 0
    NAME: string = ''
    CODE: string = ''
    PICTURE?: Image
    CHILDREN: SectionModel[] = []
    PROPS: ElementProp[] = []

    @observable
    propValue: Record<string, any> = {}

    @observable
    prop: Record<string, ElementProp> = {}

    constructor(data?: Section, observer: boolean = false) {
        if (data) {
            Object.assign(this as any, data)
            this.indexProps(this.PROPS)
        }
        if (observer)
            makeObservable(this)
    }

    @action
    indexProps(props: ElementProp[]) {
        for (let prop of props) {
            if (prop.CODE) {
                this.prop[prop.CODE] = prop
                if (prop.TYPE === 'file') {
                    this.propValue[prop.CODE] = prop.FILE?.SRC
                } else {
                    this.propValue[prop.CODE] = prop.VAL
                }
            }
        }
    }

    getMenuItem(): TCatalogMenuItem {
        return {
            title: this.NAME,
            type: 'section',
            code: 'section-' + this.ID,
            entityId: this.ID,
            imageSrc: this.imageSrc
        }
    }

    @computed({keepAlive: true})
    get imageSrc() {
        logComputed(this, 'imageSrc')
        const src = this.PICTURE?.SRC
        return src ? imagerService.resolve(src, 200) : undefined
    }

    @computed({keepAlive: true})
    get imageSrcRequired() {
        return this.imageSrc || imagerService.resolve('/images/placeholder.png', 200)
    }
}

export type TSectionModelData = Pick<SectionModel,
    'ID' |
    'IBLOCK_SECTION_ID' |
    'NAME' |
    'CODE' |
    'PICTURE'>


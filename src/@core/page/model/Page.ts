import {ElementModel} from "@core/main/model/Element";
import {PageDataChunk, PageElement} from "~gql/api";
import {action, computed, makeObservable} from "mobx";

export class PageModel extends ElementModel {

    DATA_CHUNKS: PageDataChunk[] = []

    constructor(data?: PageElement, observer: boolean = true) {
        super(null, false)
        data && this.fill(data)
        observer && makeObservable(this)
    }

    @action
    fill(data: PageElement) {
        Object.assign(this as any, data)
        this.indexProps(this.PROPS)
    }

    @computed
    get pageOptions() {
        return this.chunk?.options || {}
    }

    @computed
    get chunk() {
        return this.DATA_CHUNKS.reduce<Record<string, any>>((map, item) => {
            map[item.CODE || ''] = item.VALUE
            return map
        }, {})
    }

    @action
    reload() {
        const fetchedPage = this.stores().page.fetchPage(this.ID)
        if (fetchedPage) {
            this.fill(fetchedPage)
        }
    }
}


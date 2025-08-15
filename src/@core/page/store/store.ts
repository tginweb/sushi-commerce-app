import {action, computed, makeObservable, observable} from "mobx"
import {PageElement} from "~gql/api";
import CommonStore from "@core/main/lib/store/common";
import {classComputedPropsCache} from "@core/main/lib/mobx/class-computed-props-cache";
import {PageModel} from "@core/page/model/Page";
import QUERY_PAGE_ELEMENT from "@core/page/gql/query/element";

export class PageStore extends CommonStore {

    @observable
    pages: PageModel[] = []

    @observable
    version: number = 0

    constructor() {
        super()
        makeObservable(this)
    }

    init() {
        this.disposers = classComputedPropsCache(this, [])
    }

    @action
    SCOPE_APP(data: any) {
        if (data.elements) this.pages = data.elements.map((element: PageElement) => new PageModel(element))
    }

    @action
    mergePage(page: PageElement | PageModel) {
        const model = page instanceof PageModel ? page : new PageModel(page)
        const foundIndex = this.pages.findIndex(item => item.ID === page.ID)
        if (foundIndex > -1) {
            this.pages[foundIndex] = model
        } else {
            this.pages.push(model)
        }
        this.version++
    }

    async fetchPage(id: number | string) {

        const filter = typeof id === 'number' ? {
            ID: {eq: id}
        } : {
            CODE: {eq: id}
        }

        const page = await QUERY_PAGE_ELEMENT.request({
            variables: {
                filter
            }
        })

        console.log('fetchPage', {filter, page})

        if (page) {
            this.mergePage(page)
        }

        return page
    }

    @computed
    get pagesByCode() {
        return this.pages.reduce<Record<string, PageModel>>((map, item) => {
            map[item.CODE] = item
            return map
        }, {})
    }

    @computed
    get currentRoutePage() {
        return this.pagesByCode[this.stores().router.currentRoute.path]
    }

    getPageByPath(url: string) {
        return this.pagesByCode[url]
    }
}

export default PageStore

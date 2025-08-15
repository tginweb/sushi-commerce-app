import {action, makeObservable, observable, runInAction} from "mobx"
import {TComponentRenderInfo, TMessage} from "@core/main/types"
import {TViewableImageState} from "@core/ui/types";
import CommonStore from "@core/main/lib/store/common";
import {classComputedPropsCache} from "@core/main/lib/mobx/class-computed-props-cache";
import {Model} from "@core/main/model/Model";
import debounce from "lodash/debounce";
import {Image} from "expo-image";
import AppConfig from "@core/main/config";


export class UIStore extends CommonStore {

    @observable
    alerts: TMessage[] = []

    @observable
    modals: any = []

    @observable
    informers: TComponentRenderInfo[] = []

    @observable
    appLayoutTabbarHeight: number = 0

    @observable
    appLayoutHeaderHeight: number = 0

    appLaunches = 0;

    @observable
    viewableImagesInfo: TViewableImageState[] = []

    @observable
    viewableImagesFetchProcess?: boolean

    viewableImagesFetchDebounced?: () => void

    viewableImagesFetched: Record<string, true> = {}

    constructor() {
        super()
        makeObservable(this)
    }

    boot() {
        const ContentBuilder = require("~ui/content-builder/Builder").ContentBuilder

        ContentBuilder.registerRenderer('text', require('~ui/content-builder/types/input').render)
        ContentBuilder.registerRenderer('view', require('~ui/content-builder/types/view').render)
        ContentBuilder.registerRenderer('card', require('~ui/content-builder/types/card').render)
        ContentBuilder.registerRenderer('array', require('~ui/content-builder/types/array').render)
        ContentBuilder.registerRenderer('picker', require('~ui/content-builder/types/picker').render)
        ContentBuilder.registerRenderer('date', require('~ui/content-builder/types/date').render)
        ContentBuilder.registerRenderer('component', require('~ui/content-builder/types/component').render)
        ContentBuilder.registerRenderer('text', require('~ui/content-builder/types/text').render)
        ContentBuilder.registerRenderer('html', require('~ui/content-builder/types/html').render)
        ContentBuilder.registerRenderer('fragment', require('~ui/content-builder/types/fragment').render)
        ContentBuilder.registerRenderer('icon', require('~ui/content-builder/types/icon').render)
        ContentBuilder.registerRenderer('button', require('~ui/content-builder/types/button').render)
    }

    init() {
        this.disposers = classComputedPropsCache(this, [])
        this.viewableImagesFetchDebounced = debounce(() => {
            this.viewableImagesFetch()
        }, 100)
    }

    @action
    async viewableImagesFetch() {

        if (this.viewableImagesFetchProcess)
            return;

        this.viewableImagesFetchProcess = true

        try {
            const LIMIT = 10

            const dateNow = Date.now()
            const itemsToFetch: TViewableImageState[] = []

            let itemsQueueCount = 0

            for (const item of [...this.viewableImagesInfo].reverse()) {
                if (
                    item.imageStatus === 'fetch' &&
                    (dateNow - item.showtime > 1000 * 2) &&
                    !this.viewableImagesFetched[item.imageUrl]
                ) {
                    itemsQueueCount++
                    if (itemsToFetch.length < LIMIT)
                        itemsToFetch.push(item)
                }
            }

            if (itemsToFetch.length)
                console.log({
                    'itemsToFetch': itemsToFetch.length,
                    'itemsQueueCount': itemsQueueCount
                })

            if (itemsToFetch.length) {

                const imageUrls = itemsToFetch.map(item => item.imageUrl)

                runInAction(() => {
                    itemsToFetch.forEach(item => {
                        item.imageStatus = 'process'
                    })
                })

                if (await Image.prefetch(imageUrls)) {
                    runInAction(() => {
                        itemsToFetch.forEach(item => {
                            item.imageStatus = 'fetched'
                            this.viewableImagesFetched[item.imageUrl] = true
                        })
                    })
                }
            }
        } catch (e) {
            console.log(e)
        }
        this.viewableImagesFetchProcess = false
    }

    @action
    viewableImagesEntitiesFocus(entities: Model[]) {

        if (Object.keys(this.viewableImagesFetched).length > AppConfig.IMAGE_CACHE_LIMIT)
            return;

        const entitiesById = entities.reduce<Record<number, Model>>((map, entity) => {
            map[entity.ID] = entity
            return map
        }, {})

        this.viewableImagesInfo = this.viewableImagesInfo.filter((item) => !!entitiesById[item.entityId])

        for (const entity of entities) {
            if (entity.getImagePrefetchUrl) {
                const url = entity.getImagePrefetchUrl()
                if (url) this.viewableImagesInfo.push({
                    entityId: entity.ID,
                    entityName: entity.NAME,
                    showtime: Date.now(),
                    imageUrl: url,
                    imageStatus: 'fetch'
                })
            }
        }

        if (this.viewableImagesFetchDebounced) {
            setTimeout(this.viewableImagesFetchDebounced, 1000)
            setTimeout(this.viewableImagesFetchDebounced, 2000)
            setTimeout(this.viewableImagesFetchDebounced, 3000)
            setTimeout(this.viewableImagesFetchDebounced, 4000)
            setTimeout(this.viewableImagesFetchDebounced, 5000)
        }
    }

    @action
    appLayoutHeaderHeightSet(value: number) {
        if (this.appLayoutHeaderHeight !== value)
            this.appLayoutHeaderHeight = value
    }

    @action
    appLayoutTabbarHeightSet(value: number) {
        if (this.appLayoutTabbarHeight !== value)
            this.appLayoutTabbarHeight = value
    }

    @action
    appLayoutGet(path: string | string[]) {
        // return deepGet(this.appLayout, path)
    }

    @action
    informerAdd(com: TComponentRenderInfo) {
        if (com.key) {
            const found = this.informers.find(item => item.key === com.key)
            if (found) {
                Object.assign(found.props, com.props)
                return
            }
        }
        this.informers.push(com)
    }

    @action
    informersDelete(params: any) {
        this.informers = []
    }

    @action
    showModal(props: any) {
        this.modals.push(props)
    }
}

export default UIStore

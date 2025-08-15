import {action, computed, makeObservable, observable, runInAction} from "mobx"
import {makePersistable} from "mobx-persist-store"
import {
    TActionCatalog,
    TCatalogSortModeValue, TCatalogUpSaleProps,
    TCatalogViewModeValue,
    TCatalogViewOptions,
    TGqlScopeCatalogApp,
    TProductVal,
    TSectionVal
} from "@core/catalog/types"
import {ProductModel} from "@core/catalog/model/Product"
import {SectionModel} from "@core/main/model/Section"
import {ProductElement, SearchSuggestion, Section} from "~gql/api";
import {task} from "../../main/lib/decorator/task";
import api_product_search, {TCatalogSearchTask} from "@core/catalog/gql/query/search"
import CommonStore from "@core/main/lib/store/common";
import {busService} from "@core/main/service/bus";
import splitWithTail from "@core/main/util/base/splitWithTail";
import {logComputed} from "@core/main/lib/mobx/log-computed";
import {TMaybe} from "@core/main/types";
import AppConfig from "@core/main/config";
import treeBuild from "@core/main/util/base/treeBuild";
import {imagePrefetch} from "~ui/image";
import toInt from "@core/main/util/base/toInt";
import isScalar from "@core/main/util/base/isScalar";

export class CatalogStore extends CommonStore {

    @observable
    sortMode: TCatalogSortModeValue = 'sort'

    @observable
    viewMode: TCatalogViewModeValue = 'list'

    @observable
    searchHistory: SearchSuggestion[] = []

    sections: SectionModel[] = []
    sectionsTree: SectionModel[] = []
    sectionsById: Record<number | string, SectionModel> = {}
    sectionsByCode: Record<string, SectionModel> = {}

    products: ProductModel[] = []
    productsBySection: Record<number, ProductModel[]> = []
    productById: Record<number, ProductModel> = []

    listsRendered: Record<string, number> = {}

    disableOpenState = false
    disableOpenTimeout: any = null
    enableOpenTimeout: any = null

    constructor() {
        super()
        makeObservable(this)
        makePersistable(this, {
            name: CatalogStore.name,
            properties: ['viewMode', 'searchHistory'],
        })
    }

    boot() {
        this.stores().menu.registerActionChannel('catalog', this.runAction.bind(this))
    }

    init() {
        /*
        this.disposers = classComputedPropsCache(this, [], [
            'popularProducts',
            'popularProductsShort',
            'requiredPriceProducts',
            'menuItems'
        ])
         */
        this.bus().on('image:bootstrapPrefetch', this.imageBootstrapPrefetch.bind(this))
    }

    imageBootstrapPrefetch() {
        imagePrefetch(this.rootSections.map(section => section.imageSrc).filter(src => !src))
    }

    @computed get productsStat() {
        return this.products.reduce((map, item) => {
            map.COUNT_ALL++
            if (item.ACTIVE)
                map.COUNT_ACTIVE++
            return map
        }, {
            COUNT_ALL: 0,
            COUNT_ACTIVE: 0,
        })
    }

    @computed get listsRenderedComplexity() {
        logComputed(this, 'listsRenderedComplexity')
        return Object.values(this.listsRendered).reduce((acc, itemsCount) => {
            acc += itemsCount
            return acc
        }, 0)
    }

    @computed get menuItems() {
        logComputed(this, 'menuItems')
        return this.sectionsTree.map((section) => {
            return section.getMenuItem()
        })
    }

    @action
    setCatalogOptions(params: TCatalogViewOptions) {

        const {
            viewMode,
            sortMode
        } = params

        busService.emit('catalog.view-options.changed', params)
        busService.emit('bus:loading-overlay.show', {message: 'Смена отображения каталога'})

        setTimeout(() => {
            busService.emit('bus:loading-overlay.hide')
        }, 1000)

        setTimeout(() => {
            runInAction(() => {
                if (viewMode)
                    this.viewMode = viewMode
                if (sortMode)
                    this.sortMode = sortMode
            })
        }, 200)
    }

    @action
    ensureProductModel(element: ProductElement | ProductModel) {
        if (!element.ID)
            return null;
        if (this.productById[element.ID])
            return this.productById[element.ID]
        const product = element instanceof ProductModel ? element : new ProductModel(element, false)

        this.products.push(product)

        if (product.saleAllow) {
            product.IBLOCK_SECTION_IDS.forEach((sectionId) => {
                if (!this.productsBySection[sectionId]) {
                    this.productsBySection[sectionId] = []
                }
                this.productsBySection[sectionId].push(product)
            })
        }

        this.productById[product.ID] = product

        return product
    }

    buildSectionsTree() {
        this.sectionsTree = treeBuild(this.sections, 'ID', 'IBLOCK_SECTION_ID', 'CHILDREN')
    }

    indexSections() {
        this.sectionsByCode = this.sections.reduce((map: any, item) => {
            map[item.CODE] = item
            return map
        }, {})
        this.sectionsById = this.sections.reduce((map: any, item) => {
            map[item.ID] = item
            return map
        }, {})
    }

    @action
    fillSections(sections: Section[]) {
        this.sections = [
            ...this.sections,
            ...this.sectionsToModels(!!this.sections.length ? sections.filter(section => !this.sectionsById[section.ID]) : sections)
        ]
        this.indexSections()
        this.buildSectionsTree()
    }

    @action
    indexProducts() {
        this.productsBySection = this.products.reduce((map: any, product) => {
            if (product.saleAllow) {
                product.IBLOCK_SECTION_IDS.forEach((sectionId) => {
                    if (!map[sectionId]) {
                        map[sectionId] = []
                    }
                    map[sectionId].push(product)
                })
            }
            return map
        }, {})

        this.productById = this.products.reduce((map: any, item) => {
            map[item.ID] = item
            return map
        }, {})

        this.products.forEach((product) => {
            if (product.SOSTAV_ROLLS_IDS.length) {
                product.setSostavRolls(product.SOSTAV_ROLLS_IDS.map(productId => this.productById[productId]).filter(product => !!product))
            }
        })
    }

    @action
    fillProducts(products: ProductElement[]) {
        this.products = [...this.products, ...this.productsToModels(!!this.products.length ? products.filter(product => !this.productById[product.ID]) : products)]
        this.indexProducts()
    }

    @action
    SCOPE_APP(data: TGqlScopeCatalogApp) {


        if (data.sections)
            this.fillSections(data.sections)

        if (data.products)
            this.fillProducts(data.products)
    }

    sectionsToModels(items: Section[]) {
        return items.map((item) => new SectionModel(item, false))
    }

    productsToModels(items: ProductElement[]) {
        return items.map((item) => new ProductModel(item, false))
    }

    @task
    queryProductSearch = ((variables) => {
        return api_product_search.request({variables}, {throwError: true})
    }) as TCatalogSearchTask

    @action
    searchHistoryAdd(newItem: SearchSuggestion) {
        if (!this.searchHistory.find(item => {
            if (newItem.label && item.label) {
                return item.label?.toLowerCase() === newItem.label?.toLowerCase()
            } else {
                return false
            }
        })) {
            this.searchHistory.push(newItem)
        }
    }

    @action
    searchHistoryDelete(item: SearchSuggestion) {
        this.searchHistory = this.searchHistory.filter((row) => {
            return row.label !== item.label
        })
    }

    @action
    searchHistoryClear() {
        this.searchHistory = []
    }

    @computed
    get rootSections() {
        logComputed(this, 'rootSections')
        return this.sectionsTree
    }

    @computed
    get popularProducts() {
        logComputed(this, 'popularProducts')
        return this.getPopularProducts(50)
    }

    @computed
    get popularProductsShort() {
        logComputed(this, 'popularProductsShort')
        return this.getPopularProducts(10)
    }

    getPopularProducts(limit: number = 50) {
        return [...this.products].filter((product) => {
            return product.SALES_COUNT > 50
        }).sort((a, b) => {
            return a.SALES_COUNT > b.SALES_COUNT ? -1 : 1
        }).slice(0, limit)
    }

    @computed
    get upSaleProducts() {
        logComputed(this, 'upSaleProducts')
        return this.getUpSaleProducts()
    }

    @computed
    get requiredPriceProducts() {
        logComputed(this, 'requiredPriceProducts')
        return this.getRequiredPriceProducts()
    }

    getRequiredPriceProducts() {
        return this.products.filter((product) => {
            return product.REQUIRED_MIN_PRICE && product.REQUIRED_MIN_PRICE > 0
        })
    }

    getGlobalUpSaleProductsIds() {
        return this.products.filter((product) => {
            return !!product.propValue.UPSALE
        }).map(product => product.ID)
    }

    getUpSaleProducts(props: TCatalogUpSaleProps = {}) {
        const {
            productsIds = [],
            productsSections = [],
            limit = 10
        } = props

        let ids: number[] = []

        if (productsIds.length) {
            ids = [...ids, ...productsIds]
        }

        if (productsSections.length) {
            productsSections.forEach(sectionId => {
                const sectionProducts = this.productsBySection[sectionId]
                if (sectionProducts && sectionProducts.length)
                    ids = [...ids, ...sectionProducts.map((product: ProductModel) => product.ID)]
            })
        }

        ids = [...ids, ...this.getGlobalUpSaleProductsIds()]

        ids = ids.slice(0, limit)

        return ids.map(id => this.productById[id]).filter(product => !!product)
    }

    @computed
    get lastSearchHistory() {
        logComputed(this, 'lastSearchHistory')
        return this.getLastSearchHistory()
    }

    getLastSearchHistory(limit = 20) {
        return [...this.searchHistory].reverse().slice(0, limit)
    }

    getProduct(productId: TProductVal) {
        let product
        if (typeof productId === 'number') {
            product = this.productById[productId]
        } else if (typeof productId === 'object') {
            product = productId
        }
        return product
    }

    getSection(sectionId: TSectionVal) {
        let section

        if (isScalar(sectionId) && (toInt(sectionId as string) > 0)) {
            section = this.sectionsById[sectionId as number]
        } else if (typeof sectionId === 'string') {
            section = this.sectionsByCode[sectionId]
        } else if (typeof sectionId === 'object') {
            section = sectionId
        }
        return section
    }

    @computed
    get isCatalogPage() {
        logComputed(this, 'isCatalogPage')
        return this.stores().router.currentRoute.path === AppConfig.APP_FRONT_PAGE
    }

    @action
    navCatalogPage(tab?: TMaybe<string>, scrollTo?: TMaybe<string>, notPreserveOnCurrentPage?: TMaybe<boolean>) {
        const emitter = this.services().bus.emitter
        emitter.emit('bus:nav:catalog', tab, scrollTo, notPreserveOnCurrentPage)
    }

    @action
    runAction(action: TActionCatalog) {

        const {params, payload} = action

        const emitter = this.services().bus.emitter

        const actionSection = (sectionId: TSectionVal) => {
            const section = this.getSection(sectionId)
            if (section) {
                if (section.CODE === 'lapsha-i-ris' || section.CODE === 'wok') {
                    this.stores().catalogConstructor.dialog.show()
                } else {
                    emitter.emit('bus:nav:catalog.section', section)
                    emitter.emit('bus:nav:catalog', 'section-' + section.ID)
                }
            }
        }

        switch (action.type) {
            case 'tab': {
                const [tabType, tabId] = splitWithTail(payload, '-', 2)
                if (tabType === 'section') {
                    actionSection(tabId)
                } else {
                    emitter.emit('bus:nav:catalog', payload)
                }
                break
            }
            case 'section': {
                actionSection(payload)
                break
            }
            case 'product': {
                const productId = toInt(params?.productId) || toInt(payload)
                const product = this.getProduct(productId)
                product && this.showProduct(product)
                break
            }
            default: {
                emitter.emit('bus:nav:catalog', action.type)
                break
            }
        }
    }


    disableOpen(timeout?: 'swipe' | 'scroll' | number) {
        let _timeout = 5000
        if (timeout) {
            if (typeof timeout === 'number')
                _timeout = timeout
            else {
                switch (timeout) {
                    case 'scroll':
                        _timeout = 50
                        break
                    case 'swipe':
                        break
                }
            }
        }
        this.disableOpenState = true
        clearTimeout(this.disableOpenTimeout)
        clearTimeout(this.enableOpenTimeout)
        this.disableOpenTimeout = setTimeout(() => {
            this.enableOpen()
        }, _timeout)
    }

    enableOpen() {
        clearTimeout(this.enableOpenTimeout)
        clearTimeout(this.disableOpenTimeout)
        this.enableOpenTimeout = setTimeout(() => {
            this.disableOpenState = false
        }, 1000)
    }

    @action
    showProduct(productId: TProductVal | ProductModel, allowSecondary: boolean = false) {
        //if (this.disableOpenState) return;

        const product = this.getProduct(productId)
        if (!product)
            return;

        if (!this.stores().productPrimaryDialog.visible) {
            this.stores().productPrimaryDialog.showProduct(product)
        } else if (allowSecondary) {
            this.stores().productSecondaryDialog.showProduct(product)
        }
    }
}

export default CatalogStore

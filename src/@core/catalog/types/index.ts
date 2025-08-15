import {ProductElement, Section} from "~gql/api";
import {SectionModel} from "@core/main/model/Section";
import {ProductModel} from "@core/catalog/model/Product";
import {TTabControllerItemProps} from "~ui/tabs";
import {TAction, TIconRender} from "@core/main/types";

export type TCatalogViewModeValue = 'grid' | 'list'

export type TCatalogViewModeOption = {
    label: string
    value: TCatalogViewModeValue
    icon: TIconRender
}

export type TCatalogSortModeValue = 'sort' | 'price_desc' | 'price_asc' | 'name' | 'popular'

export type TCatalogSortModeOption = {
    label: string
    value: TCatalogSortModeValue
}

export type TCatalogFiltersValue = {
    category: number
    tag: number[]
}

export type TCatalogViewOptions = {
    viewMode?: TCatalogViewModeValue
    sortMode?: TCatalogSortModeValue
}


export type TCatalogNavValue = {}

export type TGqlScopeCatalogApp = {
    sections: Section[]
    products: ProductElement[]
    constructorProducts: ProductElement[]
    constructorSections: Section[]
    buildsBestseller: any
}

export type TActionCatalog = TActionCatalogIndex | TActionCatalogTab | TActionCatalogProduct | TActionCatalogSection

export type TActionCatalogIndex = TAction & {
    type: 'index'
}

export type TActionCatalogTab = TAction & {
    type: 'tab'
    payload: string
}

export type TActionCatalogSection = TAction & {
    type: 'section'
    payload: TSectionVal
}

export type TActionCatalogProduct = TAction & {
    type: 'product'
    payload: TProductVal
}


export type TCatalogTabType = 'front' | 'section' | 'fav' | 'popular' | 'page'

export type TCatalogTabState = {
    activeSection: number
}

export type TCatalogTab = {
    title?: string
    code: string
    type: TCatalogTabType
    entityId?: number
    section?: SectionModel
    showMoreSection?: boolean
    tabs?: TCatalogTab[]
    tabsItems?: TTabControllerItemProps[]
    condition?: () => boolean
    Content?: any
    listOptions: {
        allowGrouping?: boolean,
        scrollTopOnCurrent?: boolean
    },
    tabbar: {
        title?: string
        bgColor?: string
        inactiveColor?: string
        icon?: (params: { color: string, focused: boolean, size: number }) => any
        hide?: boolean
    }
}

export type TProductCalculation = {
    priceBase: number
    priceDiscounted: number
    discountPercent: number
}

export type TCatalogMenuItem = {
    title: string
    code: string
    type?: TCatalogTabType
    entity?: any
    entityId?: number
    cardTheme?: string
    imageSrc?: string
    icon?: any
}

export type TProductVal = number | string | ProductModel
export type TSectionVal = number | string | SectionModel
export type TTabVal = number | string

export type TCatalogUpSaleProps = {
    productsIds?: number[],
    productsSections?: number[],
    limit?: number
}



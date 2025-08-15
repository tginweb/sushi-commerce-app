import {TCatalogSortModeOption, TCatalogViewModeOption} from "@core/catalog/types";
import icons from "~assets/icons-map";

export const CATALOG_SORT_MODE_OPTIONS: TCatalogSortModeOption[] = [
    {
        label: 'По порядку',
        value: 'sort'
    },
    {
        label: 'Сначала дорогие',
        value: 'price_desc'
    },
    {
        label: 'Сначала дешевые',
        value: 'price_asc'
    },
    {
        label: 'По алфавиту',
        value: 'name'
    },
    {
        label: 'По популярности',
        value: 'popular'
    },
]

export const CATALOG_VIEW_MODE_OPTIONS: TCatalogViewModeOption[] = [
    {
        label: 'список',
        value: 'list',
        icon: icons.list
    },
    {
        label: 'сетка',
        value: 'grid',
        icon: icons.grid
    },
]

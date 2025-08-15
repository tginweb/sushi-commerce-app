import {TCatalogSortModeOption} from "@core/catalog/types";

export function useCatalogSort() {

    const options: TCatalogSortModeOption[] = [
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

    return {
        options
    }
}

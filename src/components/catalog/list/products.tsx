import React, {useEffect, useImperativeHandle} from "react"
import {StyleSheet} from "react-native"
import {ProductModel} from "@core/catalog/model/Product"
import {View} from "react-native-ui-lib"
import {useStores} from "~stores"
import {GridListProps} from "react-native-ui-lib/src/components/gridList/types"
import {observer} from "mobx-react";
import {useServices} from "~services";
import {
    CatalogSectionTabPublicApi,
    useCatalogList,
    useCatalogOptions,
    useCatalogOptionsSheet,
    useCatalogRefs,
    useCatalogTheme,
    useProductsFilterAndSort
} from "~com/catalog/list/index.hooks";
import {useCatalogTab} from "@core/catalog/hooks/useCatalogTab";
import {TCatalogFiltersValue, TCatalogTab, TCatalogViewModeValue} from "@core/catalog/types";
import {TabBarStandaloneProps} from "~ui/tab-view/TabBarStandalone";

export type CatalogProductsProps = {
    tab: TCatalogTab
    elements: ProductModel[]
    emptyComponent?: any
    gridProps?: Partial<GridListProps>
    productDeps?: any
    headerSlot?: any
    viewModeLazy?: boolean
    viewMode?: TCatalogViewModeValue
    categoriesTabsShow?: boolean
    categoriesTabsProps?: Partial<TabBarStandaloneProps<any>>
    onFilter?: (filter: TCatalogFiltersValue) => void
    //viewModeToggle?: boolean
}

export const CatalogProductsComponent: React.FC<CatalogProductsProps> = (
    {
        tab,
        elements,
        gridProps,
        productDeps,
        headerSlot,
        viewModeLazy = true,
        emptyComponent,
        viewMode,
        categoriesTabsShow = false,
        categoriesTabsProps,
        onFilter,
        //viewModeToggle = true,
        ...rest
    },
    ref
) => {


    const {catalog} = useStores()
    const {bus} = useServices()

    const _viewMode = viewMode || catalog.viewMode

    const refs = useCatalogRefs()
    const theme = useCatalogTheme(_viewMode)
    const catalogTab = useCatalogTab(tab)

    useImperativeHandle<any, CatalogSectionTabPublicApi>(ref, () => ({
        setSection,
    }));

    const setSection = (sectionId: number) => {
        options.setFromFilters({
            category: sectionId
        }, true)
        scrollTo('top')
    }

    const onSetFormFilters = (value: TCatalogFiltersValue) => {
        onFilter && onFilter(value)
        categoriesTabs && categoriesTabs.tabs.changeValue(value.category || 'all')
    }

    const options = useCatalogOptions({
        tabInfo: tab,
        products: elements,
        deps: tab.code,
        onSetFormFilters
    })
    const {productsFilteredSorted} = useProductsFilterAndSort({
        products: elements,
        filtersValue: options.filters,
        navValue: options.nav,
        deps: productDeps
    })
    const optionsSheet = useCatalogOptionsSheet({
        products: elements,
        viewMode: catalog.viewMode,
        viewModeToggle: false,
        tab: catalogTab,
        refs,
        options,
    })
    const {categoriesTabs, scrollUp, grid, onTabActiveStateChange, scrollTo} = useCatalogList(
        {
            tab: catalogTab,
            products: elements,
            emptyComponent: emptyComponent,
            productsFilteredSorted,
            viewMode: _viewMode,
            viewModeToggle: !viewMode,
            viewModeCustomAllow: false,
            categoriesTabsShow,
            categoriesTabsProps,
            refs,
            options,
            theme,
            onOpenFilters: optionsSheet.sheet.show,
            headerSlot,
            gridProps,
        }
    )

    useEffect(() => {
        if (viewModeLazy) {
            bus.emitter.on('screen.catalog.change-tab-section', onTabActiveStateChange)
        }
        return () => {
            if (viewModeLazy) {
                bus.emitter.off('screen.catalog.change-tab-section', onTabActiveStateChange)
            }
        }
    }, [])

    return <View flex {...rest}>
        {categoriesTabs && categoriesTabs.rendered}
        {scrollUp}
        {grid}
        {optionsSheet.render}
    </View>
}

const styles = StyleSheet.create({})

// @ts-ignore
export const CatalogProducts = observer(React.forwardRef<CatalogSectionTabPublicApi, CatalogProductsProps>(CatalogProductsComponent))

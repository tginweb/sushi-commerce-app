import React, {useEffect, useImperativeHandle} from "react"
import {StyleSheet} from "react-native"
import {ProductModel} from "@core/catalog/model/Product"
import {View} from "react-native-ui-lib"
import {useStores} from "~stores"
import {SectionModel} from "@core/main/model/Section"
import {
    CatalogSectionTabPublicApi,
    useCatalogList,
    useCatalogOptions,
    useCatalogOptionsSheet,
    useCatalogRefs,
    useCatalogTheme,
    useProductsFilterAndSort
} from "./index.hooks";
import {observer} from "mobx-react";
import {useServices} from "~services";
import {useCatalogTab} from "@core/catalog/hooks/useCatalogTab";
import {TCatalogFiltersValue, TCatalogTab, TCatalogTabState} from "@core/catalog/types";

type TProps = {
    tab: TCatalogTab
    state: TCatalogTabState
    section: SectionModel
    nextSection?: SectionModel
    products: ProductModel[]
    onNext?: () => void
    onFilter?: (filter: TCatalogFiltersValue) => void
}


const CatalogSectionComponent: React.FC<TProps> = (
    {
        tab,
        state,
        section,
        nextSection,
        products,
        onNext,
        onFilter,
        ...rest
    },
    ref
) => {

    //console.log('RENDER SECTION', tab.title)

    const {catalog, vorder} = useStores()
    const {bus} = useServices()

    const refs = useCatalogRefs()
    const theme = useCatalogTheme(catalog.viewMode)
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
    }

    const options = useCatalogOptions({
        tabInfo: tab,
        products,
        deps: section.ID,
        onSetFormFilters
    })

    const {productsFilteredSorted} = useProductsFilterAndSort({
        products,
        filtersValue: options.filters,
        navValue: options.nav,
        deps: section.ID
    })

    const optionsSheet = useCatalogOptionsSheet({
        products,
        viewMode: catalog.viewMode,
        viewModeToggle: true,
        tab: catalogTab,
        refs,
        options,
    })

    const {
        grid,
        onTabActiveStateChange,
        onTabPressed,
        listRef,
        categoriesTabs,
        scrollUp,
        scrollTo
    } = useCatalogList(
        {
            tab: catalogTab,
            productsFilteredSorted,
            products,
            viewMode: catalog.viewMode,
            viewModeToggle: true,
            viewModeCustomAllow: true,
            refs,
            options,
            theme,
            nextSection,
            onNext,
            onOpenFilters: optionsSheet.sheet.show,
        }
    )

    useEffect(() => {
        bus.emitter.on('screen.catalog.change-tab-section', onTabActiveStateChange)
        bus.emitter.on('screen.catalog.tab-pressed', onTabPressed)
        return () => {
            bus.emitter.off('screen.catalog.change-tab-section', onTabActiveStateChange)
            bus.emitter.off('screen.catalog.tab-pressed', onTabPressed)
        }
    }, [])

    return <View flex {...rest}>
        {scrollUp}
        {grid}
        {optionsSheet.render}
    </View>
}

const styles = StyleSheet.create({})

// @ts-ignore
export const CatalogSection = observer(React.forwardRef<CatalogSectionTabPublicApi, TProps>(CatalogSectionComponent))

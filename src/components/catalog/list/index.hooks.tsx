import {listStyles} from './index.styles'
import React, {MutableRefObject, useCallback, useEffect, useMemo, useRef, useState} from "react";
import {ProductModel} from "@core/catalog/model/Product";
import {ProductCardList} from "~com/catalog/product/card/card-list";
import {ProductCardListSet} from "~com/catalog/product/card/card-list-set";
import {ProductCardGrid} from "~com/catalog/product/card/card-grid";
import {ProductCardBuild} from "~com/catalog/product/card/card-build";
import {
    TCatalogFiltersValue,
    TCatalogNavValue,
    TCatalogSortModeValue,
    TCatalogTab,
    TCatalogViewModeValue,
    TCatalogViewOptions
} from "@core/catalog/types";
import {TDirectionVertical, TFilterItem, TFilterOption, TScrollState} from "@core/main/types";
import {FilterField} from "~ui/filter/field";
import {FilterControlChips} from "~ui/filter/control/chips";
import {SectionModel} from "@core/main/model/Section";
import {Text, View} from "react-native-ui-lib";
import {UiBtn, UiBtnProps} from "~ui/btn";
import icons from "~assets/icons-map";
import {FilterFields} from "~ui/filter/fields";
import {useStores} from "~stores";
import {CatalogNextSection} from "~com/catalog/list/components/next-section";
import {FlatList, NativeScrollEvent, NativeSyntheticEvent, View as NativeView} from "react-native";
import {UiBottomSheet, UiBottomSheetMethods, useBottomSheetScope} from "~com/ui/bottom-sheet";
import {useCatalogTab} from "@core/catalog/hooks/useCatalogTab";
import {COLORS, TYPOGRAPHY, wHeight} from "~assets/design";
import {UiGridList} from "~ui/grid-list/grid-list";
import render from "@core/main/util/react/render";
import {ProductTag} from "~gql/api";
import Reanimated from "react-native-reanimated";
import {UiSegments} from "~ui/segments";
import {useStateRef} from "@core/main/lib/hooks/useStateRef";
import {CatalogScrollUp, CatalogScrollUpPublicMethods} from "~com/catalog/list/components/scroll-up";
import {UiGridListProps} from "~ui/grid-list/types";
import {busService} from "@core/main/service/bus";
import {TTabControllerItemProps, TTabControllerOnChangeValue, useTabs} from "~ui/tabs";
import {verticalScale} from "@core/main/lib/scale";
import {CATALOG_TABBAR_BG_COLOR} from "~com/catalog/screen/catalog/index.styles";
import {TabBarStandalone, TabBarStandaloneProps} from "~ui/tab-view/TabBarStandalone";
import plural from "plural-ru";
import {UiSelect} from "~ui/select";
import {CATALOG_SORT_MODE_OPTIONS, CATALOG_VIEW_MODE_OPTIONS} from "@core/catalog/data";
import isEmpty from "lodash/isEmpty";
import {useServices} from "~services";

const viewModesScheme: Record<string, {
    list: Partial<UiGridListProps>
}> = {
    'list': {
        list: {
            numColumns: 1,
            windowSize: 20,
            initialNumToRender: 6,
            itemSpacing: 10,
            listContentPadding: 10,
            style: listStyles.listStyle
        }
    },
    'grid': {
        list: {
            numColumns: 2,
            windowSize: 20,
            initialNumToRender: 6,
            itemSpacing: 10,
            listContentPadding: 10,
            style: listStyles.gridStyle,
            contentContainerStyle: listStyles.gridStyleContent
        }
    }
}

export type TProductTagComputed = ProductTag & { COUNT: number, SECTION_IDS: Record<any, number> }

const filterFn = (products: ProductModel[], filters: TCatalogFiltersValue) => {
    return products.filter(product => {
        if (filters) {
            if (filters.category && (product.IBLOCK_SECTION_IDS.indexOf(filters.category) === -1))
                return false
            if (filters.tag && filters.tag.length && !filters.tag.find(filterTagId => product.TAGS.find(productTag => productTag.ID === filterTagId)))
                return false
        }
        return true
    })
}

export function useCatalogTheme(viewMode: TCatalogViewModeValue) {
    return viewModesScheme[viewMode]
}

export function useCatalogRefs() {
    return {
        layout: React.useRef<NativeView | null>(null),
        nextSection: React.useRef<any>(null),
        optionsSheet: React.useRef<UiBottomSheetMethods>(null as any),
    }
}

export function useProductsFilterAndSort(props: {
    products: ProductModel[],
    filtersValue: TCatalogFiltersValue,
    navValue: TCatalogNavValue,
    deps?: any
}) {

    const {catalog} = useStores()

    const {
        products,
        filtersValue,
        navValue,
        deps
    } = props

    const sortFn = (
        products: ProductModel[],
        sort: TCatalogSortModeValue
    ) => {
        return products.sort((a, b) => {
            const aPrice = a.PRICE?.PRICE || 0
            const bPrice = b.PRICE?.PRICE || 0
            switch (sort) {
                case "sort":
                    return a.SORT - b.SORT
                case "name":
                    return a.NAME && b.NAME ? a.NAME.localeCompare(b.NAME) : 0
                case "price_desc":
                    return aPrice > bPrice ? -1 : 1
                case "price_asc":
                    return aPrice > bPrice ? 1 : -1
                case "popular":
                    return a.SALES_COUNT - b.SALES_COUNT
            }
            return 0
        })
    }

    const productsFilteredSorted = useMemo(() => {
        let _products = [...(products || [])]
        _products = filterFn(_products || [], filtersValue)
        if (catalog.sortMode) {
            sortFn(_products, catalog.sortMode)
        }
        return _products
    }, [filtersValue, navValue, catalog.sortMode, deps])

    return {
        filterFn,
        productsFilteredSorted
    }
}

export function useCatalogTabs(
    props: {
        tab: ReturnType<typeof useCatalogTab>,
        options: ReturnType<typeof useCatalogOptions>,
        listRef: MutableRefObject<FlatList | null>,
        tabbarProps?: Partial<TabBarStandaloneProps<any>>
    }
) {

    const {
        tab,
        listRef,
        options,
        tabbarProps
    } = props

    const items = useMemo(() => {
        const res: TTabControllerItemProps[] = options.categories.map(cat => ({
            label: cat.label,
            value: !cat.value ? 'all' : cat.value
        } as TTabControllerItemProps))
        return res
    }, [options.categories])

    const onChangeTab = useCallback<TTabControllerOnChangeValue>((
        newValue,
        newIndex,
        newItem,
        fromExternal
    ) => {
        setTimeout(() => {
            if (!fromExternal) {
                options.setFromFilters({
                    category: newValue === 'all' ? 0 : newValue
                }, true)
            }
            listRef.current?.scrollToOffset({
                animated: true,
                offset: 0
            })
        }, 50)
    }, [])

    const tabs = useTabs<number>({
        value: 0,
        items: items,
        onChangeValue: onChangeTab,
        onChangeTabExternal: (newValue, newIndex, newItem) => {
            tabs.setState({
                value: newValue,
                index: newIndex
            })
        }
    })

    const rendered = useMemo(() => {
        return !!items.length && <TabBarStandalone
            items={tabs.items}
            activeIndex={tabs.activeIndex}
            onTabPress={(scene: any) => {
                const routeKey = scene.route.key
                const tabIndex = tabs.items.findIndex((item: TTabControllerItemProps) => {
                    return item.value === routeKey
                })
                onChangeTab(routeKey, tabIndex, tabs.items[tabIndex], false)
            }}
            scrollEnabled={true}
            style={{
                backgroundColor: CATALOG_TABBAR_BG_COLOR,
                elevation: 0,
            }}
            contentContainerStyle={{
                marginHorizontal: 10
            }}
            tabStyle={{
                width: 'auto',
                paddingVertical: verticalScale(15),
                paddingHorizontal: 6,
                minHeight: 'auto',
                flexDirection: 'row',
                alignContent: 'center',
                alignItems: 'center',
                gap: 1
            }}
            labelStyle={{
                marginVertical: 0,
                marginHorizontal: 0,
                paddingTop: 2,
                //borderWidth: 1,
                color: COLORS.grey20,
                ...TYPOGRAPHY['text-xs-m-lh0'],
            }}
            activeColor={COLORS.primary}
            inactiveColor={COLORS.grey20}
            indicatorStyle={{
                backgroundColor: COLORS.primary
            }}
            {...tabbarProps}
        />
    }, [items, tabs.activeIndex])

    useEffect(() => {
        //updatePortal('root', rendered)
    }, [rendered])

    const onChangeIsCurrent = (isCurrent: boolean) => {
        if (isCurrent) {
            //updatePortal('root', rendered)
        }
    }

    return {
        rendered,
        tabs,
        onChangeIsCurrent
    }
}

export function useCatalogList(
    props: {
        tab: ReturnType<typeof useCatalogTab>,
        subtitle?: string | null | false,
        emptyComponent?: any,
        products: ProductModel[],
        productsFilteredSorted: ProductModel[],
        viewMode: TCatalogViewModeValue,
        viewModeToggle: boolean,
        viewModeCustomAllow: boolean,
        refs: ReturnType<typeof useCatalogRefs>,
        options: ReturnType<typeof useCatalogOptions>,
        theme: ReturnType<typeof useCatalogTheme>,
        nextSection?: SectionModel | null | undefined,
        onNext?: () => void,
        onOpenFilters?: () => void,
        headerSlot?: any,
        gridProps?: any,
        categoriesTabsShow?: boolean
        categoriesTabsProps?: Partial<TabBarStandaloneProps<any>>
    }
) {


    const {
        tab,
        subtitle,
        productsFilteredSorted,
        products,
        viewMode,
        viewModeToggle = true,
        refs,
        options,
        theme,
        nextSection,
        onNext,
        onOpenFilters,
        viewModeCustomAllow,
        headerSlot,
        gridProps,
        emptyComponent,
        categoriesTabsShow,
        categoriesTabsProps
    } = props

    const {catalog, ui} = useStores()

    const [groupBySection, setGroupBySection] = useState(false)

    const scrollRef = useRef<any>()
    const scrollUpRef = useRef<CatalogScrollUpPublicMethods>(null as any)

    const listRef = useRef<FlatList | null>(null)

    const scrollState = useRef<TScrollState>({
        offset: 0,
        direction: null,
        directionPrev: null,
        directionStartOffset: 0,
        directionOffset: 0,
        speed: 0,
        speedTimeout: null,
        speedLastPos: 0
    })

    const categoriesTabs = categoriesTabsShow && useCatalogTabs({
        tab,
        options,
        listRef,
        tabbarProps: categoriesTabsProps
    })

    const onTabActiveStateChange = useCallback((newTab: TCatalogTab) => {

        if (tab.info.code === newTab.code) {
            tab.setIsCurrentTab(true)

            categoriesTabs && categoriesTabs.onChangeIsCurrent(true)

            setTimeout(() => {
                if (scrollRef.current)
                    scrollRef.current.scrollToSelectedFilter()
            }, 300)

            if (tab.info.listOptions.scrollTopOnCurrent && false) {
                setTimeout(() => {
                    //console.log('CURRENT TAB: SCROLL TOP', tab.isCurrentRef.current, listRef.current)

                    if (!tab.isCurrentRef.current)
                        return;

                    if (listRef.current) {
                        listRef.current?.scrollToOffset({
                            animated: true,
                            offset: 0
                        })
                    }
                }, 100)
            }

        } else {
            tab.setIsCurrentTab(false)
            categoriesTabs && categoriesTabs.onChangeIsCurrent(false)
        }
    }, [])

    const onTabPressed = useCallback((newTab: TCatalogTab) => {
        if (tab.info.code === newTab.code) {
            setTimeout(() => {
                console.log('newTab.code', newTab.code)
                //if (!tab.isCurrentRef.current) return;
                if (listRef.current) {
                    listRef.current?.scrollToOffset({
                        animated: true,
                        offset: 0
                    })
                }
            }, 100)
        }
    }, [])

    /*
    useEffect(useCallback(() => {
        if (tab.isCurrent) {
            setTimeout(() => {
                if (scrollRef.current)
                    scrollRef.current.scrollToSelectedFilter()
            }, 300)
        }
    }, [tab.isCurrent]), [tab.isCurrent])
    */

    const onScrollBeginDrag = useCallback(() => {
        //catalog.disableOpen('scroll')
    }, [])

    const onScrollEndDrag = useCallback(() => {
        // catalog.enableOpen()
    }, [])

    const onScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {

        const nativeEvent = e.nativeEvent
        const {contentOffset, layoutMeasurement, contentSize} = nativeEvent
        const eventOffset = contentOffset.y

        if (eventOffset > wHeight / 1.6) {
            scrollUpRef.current?.show()
        } else {
            scrollUpRef.current?.hide()
        }

        const percent = ((layoutMeasurement.height + eventOffset) / contentSize.height) * 100;

        const stateOffset = scrollState.current.offset

        let newDirection: TDirectionVertical = eventOffset > stateOffset ? 'down' : 'up'

        if (newDirection !== scrollState.current.direction) {
            scrollState.current.directionStartOffset = eventOffset
            scrollState.current.direction = newDirection
        }

        scrollState.current.directionOffset = Math.abs(eventOffset - scrollState.current.directionStartOffset)
        scrollState.current.offset = eventOffset
        scrollState.current.speed = Math.abs(eventOffset - stateOffset)

        busService.emit('catalog.scroll', scrollState.current)

        refs.nextSection.current && refs.nextSection.current.onScroll(scrollState.current)
    }, [])

    const titleRendered = <Text text-xl-bo-lh0>
        {tab.info.title}
    </Text>

    const subtitleRendered = !!subtitle && false && <Reanimated.Text
        text-sm-lh0
        style={[
            //subtitleAnimStyle
        ]}
    >
        {subtitle}
    </Reanimated.Text>

    const filterButtonRendered = useMemo(() => {
        return <View row gap-12>
            {!!options.filters.tag && options.filters.tag?.length >= 2 && <UiBtn
                size={'large'}
                iconSize={14}
                icon={icons.del}
                label={'сброc'}
                style={{}}
                link={true}
                text-md-m
                onPress={() => {
                    options.resetFilters()
                }}
            />}
            <UiBtn
                size={'large'}
                iconSize={20}
                icon={icons.filters}
                label={'фильтры'}
                style={{}}
                link={true}
                text-md-m
                onPress={() => {
                    onOpenFilters && onOpenFilters()
                }}
            />
        </View>
    }, [options.filtersFilled, options.filters.tag])

    const headerRendered = useMemo(() => {
        return headerSlot ?
            headerSlot({
                title: titleRendered
            })
            :
            <View gap-12 marginV-8>
                <View row centerV paddingT-13 gap-16>
                    <View flexG row centerV gap-8 marginT-2>
                        {titleRendered}
                        {icons.angleRight({size: 10})}
                        {subtitleRendered}
                    </View>
                    <View row gap-12>
                        {filterButtonRendered}
                    </View>
                </View>
                {
                    (options.filters.category || !!options.filters.tag?.length) && <View>
                        <View
                            row
                            gap-10
                            flexG
                            style={{
                                flexWrap: 'wrap',
                                flexShrink: 1
                            }}
                        >
                            {!!options.filters.category &&
                                <FilterControlChips
                                    filter={{
                                        multiple: false,
                                        type: 'number',
                                        options: options.categories,
                                    }}
                                    selectedOnly={true}
                                    value={options.filters.category}
                                    onChange={(v) => {
                                        options.setFromFilters({
                                            category: 0
                                        })
                                    }}
                                    itemProps={{
                                        dismissIconStyle: {width: 8},
                                        containerStyle: {
                                            paddingVertical: 3,
                                        },
                                        labelStyle: {
                                            ...TYPOGRAPHY['text-sm-lh2'],
                                            marginLeft: 5,
                                        }
                                    }}
                                />
                            }
                            <FilterControlChips
                                filter={{
                                    multiple: true,
                                    type: 'number',
                                    options: options.tags,
                                }}
                                selectedOnly={true}
                                value={options.filters.tag}
                                onChange={(v) => {
                                    options.setFromFilters({
                                        tag: v
                                    })
                                }}
                                itemProps={{
                                    containerStyle: {
                                        paddingVertical: 3,
                                    },
                                    labelStyle: {
                                        ...TYPOGRAPHY['text-sm-lh2'],
                                        marginLeft: 5,
                                    }
                                }}
                            />

                        </View>
                    </View>
                }
            </View>
    }, [
        headerSlot,
        viewModeToggle,
        viewMode,
        subtitle,
        options.filters,
        //options.optionsFilled
    ])


    const renderProduct = useCallback(({item}: {
        item: ProductModel
    }, style = {}, overrideViewMode?: TCatalogViewModeValue) => {

        let ProductViewComponent: typeof ProductCardBuild | typeof ProductCardListSet | typeof ProductCardList | typeof ProductCardGrid

        const _viewMode = overrideViewMode ? overrideViewMode : viewMode

        if (viewModeCustomAllow && item.IBLOCK_ID === 37) {
            ProductViewComponent = ProductCardBuild
        } else if (viewModeCustomAllow && viewMode === 'list' && item.SOSTAV_ROLLS_IDS.length) {
            ProductViewComponent = ProductCardListSet
        } else if (_viewMode === 'list') {
            ProductViewComponent = ProductCardList
        } else {
            ProductViewComponent = ProductCardGrid
        }

        return <ProductViewComponent
            key={item.ID}
            entity={item}
            style={style}
        />
    }, [viewMode, groupBySection])


    const scrollTo = useCallback((name: 'top' = 'top') => {
        listRef.current?.scrollToOffset({
            animated: true,
            offset: 0
        })
    }, [])

    const scrollUp = useMemo(() => {
        return <CatalogScrollUp
            ref={scrollUpRef}
            onPress={scrollTo}
        />
    }, [scrollTo])

    const showNextSection = useMemo(() => {
        return !!nextSection && !!productsFilteredSorted.length && (!options.filtersFilled || productsFilteredSorted.length >= 4)
    }, [nextSection, productsFilteredSorted.length])


    const footerRendered = useMemo(() => {
        //console.log('renderedFooter')

        const filterSection = options.filters.category && catalog.sectionsById[options.filters.category]

        return <>

            {tab.info.showMoreSection && !!filterSection &&
                <View marginT-20 marginB-30 centerH gap-10>
                    <Text text-md center>
                        Показано только
                        <Text text-md-m> «{tab.info.title}» </Text>
                        в категории
                        <Text text-md-m> «{filterSection.NAME}»</Text>.
                    </Text>
                    <UiBtn
                        outline={true}
                        size={'medium'}
                        color={COLORS.primary}
                        label={'Показать все «' + filterSection.NAME + '»'}
                        onPress={() => filterSection && catalog.runAction({
                            type: 'section',
                            payload: filterSection.ID
                        } as any)}
                    />
                </View>
            }

            {showNextSection && nextSection && <CatalogNextSection
                nextSection={nextSection}
                onNext={onNext}
                ref={refs.nextSection}
            />}
        </>
    }, [showNextSection, options.filters.category])

    const listData = useMemo(() => {
        return productsFilteredSorted
    }, [productsFilteredSorted])

    const sectionsData = useMemo(() => {

        const productsBySection = productsFilteredSorted.reduce<Record<number, ProductModel[]>>((map, product) => {
            if (!map[product.IBLOCK_SECTION_ID])
                map[product.IBLOCK_SECTION_ID] = []
            map[product.IBLOCK_SECTION_ID].push(product)
            return map
        }, {})

        return Object.keys(productsBySection)
            .map((sectionId) => {
                return catalog.sectionsById[sectionId]
            })
            .filter(section => {
                return !!section
            }).map((section) => {
                const sectionProducts = productsBySection[section.ID]
                return {
                    title: section.NAME,
                    key: section.ID,
                    data: [
                        {
                            key: section.ID,
                            list: sectionProducts
                        }
                    ]
                }
            })
    }, [productsFilteredSorted])

    const _gridProps = useMemo(() => {
        //console.log('_gridProps')
        let res: Partial<UiGridListProps> = {
            ListHeaderComponent: headerRendered,
            ListFooterComponent: footerRendered,
            onScroll,
            onScrollBeginDrag,
            onScrollEndDrag,
            scrollEventThrottle: 30,
            keyExtractor: true,
            ...(gridProps || {}),
            ...theme.list,
        }
        return res
    }, [
        viewMode,
        headerRendered,
        footerRendered,
        gridProps,
        onScrollBeginDrag,
        onScrollEndDrag
    ])

    const grid = useMemo(() => {
        if (products.length || !emptyComponent) {
            return <UiGridList
                {..._gridProps}
                data={listData}
                renderItem={renderProduct as any}
                ref={listRef}
            />
        } else {
            return <View paddingH-10 bg-white flex>
                {headerRendered}
                {render(emptyComponent)}
            </View>
        }
    }, [
        viewMode,
        listData,
        sectionsData,
        headerRendered,
        emptyComponent,
        _gridProps
    ])

    return {
        categoriesTabs,
        listRef,
        renderProduct,
        grid,
        onTabActiveStateChange,
        onTabPressed,
        scrollUp,
        scrollTo
    }
}

export function useCatalogOptions(
    {
        tabInfo,
        onSetFormFilters,
        products,
        deps
    }: {
        tabInfo: TCatalogTab,
        products: ProductModel[],
        onSetFormFilters?: (data: TCatalogFiltersValue) => void,
        deps?: any
    }
) {

    const {catalog} = useStores()

    // VALUES

    const [filters, setFilters, filtersRef, filtersUpdate] = useStateRef<TCatalogFiltersValue>({
        category: 0,
        tag: [],
    })

    const [nav, setNav] = useState<TCatalogNavValue>({
        sort: 'sort',
    })

    const filtersFilled = useMemo(() => {
        return filters.category || !!filters.tag.length
    }, [filters])

    // FILTERS

    const tagsList = useMemo<TProductTagComputed[]>(() => {
        const map: Record<number, TProductTagComputed> = {}
        products.forEach(element => {
            if (element.TAGS && element.TAGS.length) {
                element.TAGS.forEach((tag) => {
                    if (!tag.ID)
                        return;
                    if (!map[tag.ID]) {
                        map[tag.ID] = {
                            ...tag,
                            COUNT: 0,
                            SECTION_IDS: {}
                        }
                    }
                    map[tag.ID].COUNT++
                    element.IBLOCK_SECTION_IDS.forEach((id) => {
                        map[tag.ID].SECTION_IDS[id] = id
                    })
                })
            }
        })
        return Object.values(map)
    }, [deps])

    const tags: TFilterOption[] = tagsList.filter(tag => {
        return !filters.category || tag.SECTION_IDS[filters.category]
    }).map((tag) => ({
        label: tag.NAME || '',
        value: tag.ID || 0,
        parentValues: Object.values(tag.SECTION_IDS)
    }))

    const tagsById = tagsList.reduce<Record<any, TProductTagComputed>>((map, item) => {
        map[item.ID] = item
        return map
    }, {})

    const categories: TFilterOption[] = useMemo(() => {

        if (!tabInfo.section) {

            const items: TFilterOption[] = Object.values(products.reduce<Record<number, number>>((map, product) => {
                map[product.IBLOCK_SECTION_ID] = product.IBLOCK_SECTION_ID
                return map
            }, {}))
                .map((sectionId) => catalog.sectionsById[sectionId])
                .filter((section) => !!section)
                .map((section) => ({
                    label: section.NAME,
                    value: section.ID,
                }))

            if (items.length)
                items.unshift({
                    label: 'Все',
                    value: 0,
                    dismissable: false
                })

            return items
        } else if (tabInfo.tabs && tabInfo.tabs.length) {
            return tabInfo.tabs.map((item) => ({
                label: item.title || '',
                value: item.entityId || 0,
                dismissable: !!item.entityId
            }))
        }
        return []
    }, [products])


    // METHODS

    const resetFilters = (noEvents: boolean = false) => {
        const newData = {
            category: 0,
            tag: []
        }
        setFromFilters(newData)
        if (!noEvents) {
            onSetFormFilters && onSetFormFilters(newData)
        }
    }

    const assignFilters = (data: TCatalogFiltersValue) => {
        setFilters({
            ...filters,
            ...data
        })
    }

    const prepareFilters = (newFilters: Partial<TCatalogFiltersValue>, prevFilters: TCatalogFiltersValue) => {

        const newData = {} as TCatalogFiltersValue

        newData.category = typeof newFilters.category !== 'undefined' ? newFilters.category : prevFilters.category

        const newTag = typeof newFilters.tag !== 'undefined' ? newFilters.tag : prevFilters.tag

        if (newTag) {
            newData.tag = newData.category === 0 || prevFilters.category === newData.category ?
                newTag
                :
                newTag.filter(tagId => tagsById[tagId] && tagsById[tagId].SECTION_IDS[newData.category || 0])
        }

        return newData
    }

    const setFromFilters = (newFilters: Partial<TCatalogFiltersValue>, noEvents: boolean = false) => {

        const newData = prepareFilters(newFilters, filtersRef.current)

        setFilters(newData)

        if (!noEvents)
            onSetFormFilters && onSetFormFilters(newData)
    }

    return {
        tagsList,
        tagsById,
        categories,
        tags,

        filters,
        setFilters,
        setFromFilters,
        assignFilters,
        prepareFilters,
        nav,
        setNav,
        filtersFilled,
        resetFilters
    }
}

export function useCatalogOptionsSheet(
    props: {
        products: ProductModel[],
        viewMode: TCatalogViewModeValue,
        viewModeToggle: boolean,
        tab: ReturnType<typeof useCatalogTab>,
        refs: ReturnType<typeof useCatalogRefs>,
        options: ReturnType<typeof useCatalogOptions>,
    }
) {

    const {
        products,
        viewMode,
        viewModeToggle,
        tab,
        refs,
        options,
    } = props

    const {bus} = useServices()

    const {catalog} = useStores()

    const [localViewMode, setLocalViewMode] = useState(viewMode)

    const [localSortMode, setLocalSortMode] = useState(catalog.sortMode)

    const [filtersValue, setFiltersValue] = useState<TCatalogFiltersValue>({
        category: 0,
        tag: [],
    })

    const onViewOptionsChanged = (options: TCatalogViewOptions) => {
        if (options.viewMode)
            setLocalViewMode(options.viewMode)
        if (options.sortMode)
            setLocalSortMode(options.sortMode)
    }

    useEffect(() => {
        bus.on('catalog.view-options.changed', onViewOptionsChanged)
        return () => {
            bus.off('catalog.view-options.changed', onViewOptionsChanged)
        }
    }, [])


    const sheet = useBottomSheetScope({})

    const productsFiltered = useMemo(() => filterFn(products, filtersValue), [filtersValue])

    const sectionsOptions = options.categories

    const tagsOptions = options.tagsList.filter(tag => {
        return !filtersValue.category || tag.SECTION_IDS[filtersValue.category]
    }).map((tag) => ({
        label: tag.NAME || '',
        value: tag.ID || 0,
        parentValues: Object.values(tag.SECTION_IDS)
    }))

    const filtersView = useMemo(() => {
        const res: TFilterItem[] = []
        if (sectionsOptions.length) {
            res.push({
                type: 'number',
                name: 'category',
                multiple: false,
                options: sectionsOptions,
                field: {
                    component: FilterField,
                },
                control: {
                    component: FilterControlChips,
                    container: {
                        row: true,
                        'gap-10': true,
                        style: {
                            flexWrap: 'wrap',
                        },
                    }
                }
            })
        }

        if (tagsOptions.length && false) {
            res.push({
                type: 'number',
                name: 'tag',
                multiple: true,
                options: tagsOptions,
                field: {
                    component: FilterField,
                    label: 'Состав'
                },
                control: {
                    component: FilterControlChips,
                    container: {
                        row: true,
                        'gap-10': true,
                        style: {
                            flexWrap: 'wrap',
                        },
                    }
                }
            })
        }
        return res
    }, [
        tab.info.code,
        sectionsOptions,
        tagsOptions,
        filtersValue
    ])

    const footerActions = useMemo(() => {
        const res: UiBtnProps[] = []
        if (filtersValue.category || filtersValue.tag.length) {
            res.push({
                outline: true,
                color: COLORS.primary,
                label: 'Сброс',
                onPress: () => {
                    setFiltersValue({
                        category: 0,
                        tag: []
                    })
                    options.resetFilters()
                    //sheet.hide()
                },
                containerStyle: {
                    flex: 7
                }
            })
            res.push({
                label: 'Показать ' + productsFiltered.length + ' ' + plural(productsFiltered.length, 'товар', 'товара', 'товаров'),
                onPress: () => {
                    options.setFromFilters(filtersValue)
                    sheet.hide()
                },
                containerStyle: {
                    flex: 17
                }
            })
        } else {
            res.push({
                label: 'Закрыть',
                onPress: () => {
                    options.resetFilters()
                    sheet.hide()
                },
                containerStyle: {
                    flex: 1
                }
            })
        }
        return res
    }, [filtersValue])

    const render = useMemo(() => sheet.visible && <UiBottomSheet
        id={'catalog-filters'}
        title={'Фильтры и вид'}
        ref={refs.optionsSheet}
        isVisible={sheet.visible}
        autoHeight={true}
        preset={'default'}
        onShow={() => {
            setFiltersValue(options.filters)
        }}
        onClose={() => {
            const viewOptions: TCatalogViewOptions = {}
            if (localViewMode !== catalog.viewMode)
                viewOptions.viewMode = localViewMode
            if (localSortMode !== catalog.sortMode)
                viewOptions.sortMode = localSortMode
            !isEmpty(viewOptions) && catalog.setCatalogOptions(viewOptions)
            sheet.hide()
        }}
        footerActionsContainerStyle={{
            flexDirection: 'row',
            gap: 10
        }}
        footerActions={footerActions}
    >
        <View paddingV-20 gap-15>

            {
                !!filtersView.length &&
                <FilterFields
                    gap-20
                    filters={filtersView}
                    value={filtersValue}
                    onChange={(v: any) => {
                        setFiltersValue(options.prepareFilters(v, filtersValue))
                    }}
                />
            }

            {viewModeToggle && <View row centerV gap-10 flex>
                <View><Text text-md-m-lh0>Вид</Text></View>
                <View marginL-auto marginR-2>
                    <UiSegments
                        value={localViewMode}
                        segments={CATALOG_VIEW_MODE_OPTIONS}
                        onChangeValue={setLocalViewMode}
                        activeColor={COLORS.primary}
                    />
                </View>
            </View>}

            <View
                row
                centerV
                gap-10
                flex
                style={{}}
            >
                <View><Text text-md-m-lh0>Сортировка</Text></View>
                <View marginL-auto marginR-2>
                    <UiSelect
                        value={localSortMode}
                        readonlyColorPreserve={false}
                        text-md-m
                        style={{
                            color: COLORS.primary
                        }}
                        items={CATALOG_SORT_MODE_OPTIONS}
                        closeOnChange={true}
                        onSelect={setLocalSortMode}
                        dialogProps={{
                            title: 'Режим сортировки'
                        }}
                    />
                </View>
            </View>
        </View>
    </UiBottomSheet>, [
        viewMode,
        localSortMode,
        localViewMode,
        sheet.visible,
        options.filters,
        catalog.sortMode,
        filtersView,
        filtersValue
    ])

    return {
        sheet,
        render
    }
}


export type CatalogSectionTabPublicApi = {
    setSection: (sectionId: number) => void
}

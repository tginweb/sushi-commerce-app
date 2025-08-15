import React, {useCallback, useRef, useState} from "react"
import {Keyboard, StyleSheet} from "react-native"
import {observer} from "mobx-react"
import {useStores} from "~stores"
import {UiScreen} from "~ui/screen"
import {TScreenProps} from "@core/main/types"
import {Colors, Text, TouchableOpacity, View} from "react-native-ui-lib"
import {ProductModel} from "@core/catalog/model/Product"
import {ProductElement, SearchSuggestion, SearchSuggestionData} from "~gql/api";
import {UiTopbar} from "~ui/topbar";
import {COLORS, wWidth} from "~assets/design";
import {UiTabBar, UiTabController, UiTabPage, useTabs} from "~ui/tabs";
import {OptionType, Select, SelectRef} from "~ui/select-pro";
import {UiLoaderScreen} from "~ui/loader-screen";
import {UiCard, UiCardProps} from "~ui/card";
import {SwipeItem, SwipeProvider} from '~ui/swipe-item';
import {UiBtn} from "~ui/btn";
import icons from "~assets/icons-map";
import {ScrollView} from "react-native-gesture-handler";
import {CatalogProducts} from "~com/catalog/list/products";
import {useFocusEffect, useLocalSearchParams} from "expo-router";
import {CatalogProductsFav} from "~com/catalog/list/products-fav";

type TSearchOption = OptionType<SearchSuggestionData>

export const SearchScreen: React.FC<TScreenProps> = observer(({}) => {

    const {catalog, main, sectionsDialog, search, vorder, fav} = useStores();

    const [activeSuggestion, setActiveSuggestion] = useState<TSearchOption | null>(null)
    const [searchProducts, setSearchProducts] = useState<ProductModel[]>([])

    const routeParams: any = useLocalSearchParams()

    type TabValueEnum = 'search' | 'fav' | 'popular'

    const tabs = useTabs<TabValueEnum>({
        value: 'search',
        items: [
            {label: 'Поиск', value: 'search'},
            {label: 'Избранное', value: 'fav'},
            //  {label: 'Популярное', value: 'popular'}
        ]
    })

    const onSearchSelectOption = async (option: TSearchOption, fromHistory = false) => {

        setActiveSuggestion(option)

        const products = await catalog.queryProductSearch({query: option.label, filterSuggestion: option.data})

        if (!fromHistory && products.length)
            catalog.searchHistoryAdd(option as SearchSuggestion)

        setSearchProducts(products.map((element: ProductElement) => new ProductModel(element, false)))
    }

    const resolveSuggestions = async (query: string) => {
        return await search.apiSearchSuggestions({query}) as TSearchOption[]
    }

    const onSearchReset = useCallback(() => {
        setActiveSuggestion(null)
        setSearchProducts([])
    }, [])

    const onSelectChangeText = useCallback((text: string) => {
        if (!text.trim()) {
            onSearchReset()
        }
    }, [])

    const optionInnerSlot = (option: TSearchOption) => {
        return <View row centerV gap-10>
            <View flexG>
                <Text>{option.label}</Text>
            </View>
            <View flex right>
                <Text text-xs grey30>{option.data?.hint}</Text>
            </View>
        </View>
    }

    const searchRef = useRef<SelectRef>()

    useFocusEffect(useCallback(() => {
        tabs.changeTab('search')
        setTimeout(() => {
            searchRef.current?.open()
        }, 100)
    }, [routeParams.focus]))

    const searchDefaultContent = () => {
        const cards: UiCardProps[] = []

        if (!!catalog.lastSearchHistory.length) {
            cards.push({
                title: 'История поиска',
                headerActions: [
                    {
                        label: 'очистить',
                        size: 'xSmall',
                        link: true,
                        color: COLORS.primary,
                        onPress: () => {
                            catalog.searchHistoryClear()
                        }
                    }
                ],
                children: <SwipeProvider>
                    {catalog.lastSearchHistory.map((item, index) => {
                        return <SwipeItem
                            disableSwipeIfNoButton
                            key={item.label}
                            height={45}
                            style={styles.historyItem}
                            swipeContainerStyle={styles.historyItemContainer}
                            rightButtons={<View style={{justifyContent: 'center'}}>
                                <UiBtn
                                    backgroundColor={Colors.red40}
                                    icon={icons.del}
                                    round={true}
                                    onPress={() => {
                                        catalog.searchHistoryDelete(item)
                                    }}
                                />
                            </View>}
                        >
                            <TouchableOpacity
                                onPress={() => {
                                    Keyboard.dismiss()
                                    searchRef.current?.selectOption(item as TSearchOption)
                                    onSearchSelectOption(item as TSearchOption, true)
                                }}
                                row
                                centerV
                                flex
                            >
                                <View flexS marginR-10>
                                    {icons.history({size: 20, color: Colors.grey40})}
                                </View>
                                <View flex row>
                                    <Text numberOfLines={1} style={{flexWrap: 'nowrap'}}>{item.label}</Text>
                                </View>
                            </TouchableOpacity>
                        </SwipeItem>
                    })}
                </SwipeProvider>
            })
        }

        return <ScrollView
            style={{flex: 1}}
            keyboardShouldPersistTaps={'handled'}
        >
            <View gap-16 paddingT-30>
                {cards.map((item, index) => {
                    return <UiCard
                        key={index}
                        {...item}
                        contentProps={{'paddingH-screenH': true}}
                        containerProps={{'gap-20': true}}
                        titleProps={{'text-sm': true, 'bold-8': true}}
                        headerProps={{'paddingH-screenH': true}}
                    />
                })}
            </View>
        </ScrollView>
    }

    const renderSearchResult = () => !!searchProducts.length ?
        <CatalogProducts
            tab={{
                code: 'search',
                type: 'page',
                listOptions: {
                    allowGrouping: true
                },
                tabbar: {
                    icon: icons.heart,
                }
            }}
            viewMode={'grid'}
            elements={searchProducts}
            headerSlot={() => <></>}

        />
        :
        <View
            paddingV-screenV
            paddingH-screenH
        >
            <Text>Результаты не найдены</Text>
        </View>

    return <UiScreen
        bodyScroll={false}
        backgroundColor={COLORS.white}
        useSafeArea={false}
        headerShown={false}
    >
        <UiTabController
            ref={tabs.ref as any}
            items={tabs.items}
            asCarousel={false}
            onChangeValue={tabs.onChangeValue}
            initialValue={tabs.activeValue}
        >
            <UiTopbar
                backEnable={true}
                topContent={
                    <UiTabBar
                        preset={'normal'}
                        height={32}
                        containerStyle={{
                            height: 32
                        }}
                        spreadItems={true}
                        indicatorInsets={10}
                        containerWidth={wWidth - 50}
                    />
                }
            />

            <View flex>

                <UiTabPage index={tabs.indexByValue.search}>
                    <View marginH-10 marginT-10>
                        <Select
                            onSelectChangeText={onSelectChangeText}
                            onSelect={(option, optionIndex) => onSearchSelectOption(option)}
                            ref={searchRef as any}
                            searchable={true}
                            clearable={false}
                            hideArrow={true}
                            placeholderText={'Введите запрос'}
                            optionsResolver={resolveSuggestions}
                            optionInnerSlot={optionInnerSlot}
                            styles={{
                                select: {
                                    arrow: {}
                                }
                            }}
                            onRemove={onSearchReset}
                            options={[]}
                            inputProps={{
                                presets: ['outline', 'md'],
                            }}
                            hasBackdrop={false}
                        />
                    </View>

                    {
                        catalog.queryProductSearch.pending ?
                            <UiLoaderScreen message={'загрузка'}/>
                            :
                            !activeSuggestion ? searchDefaultContent() : renderSearchResult()
                    }

                </UiTabPage>
                <UiTabPage index={tabs.indexByValue.fav} lazy>
                    <CatalogProductsFav
                        tab={{
                            title: 'Избранное',
                            code: 'fav',
                            type: 'page',
                            listOptions: {
                                allowGrouping: true
                            },
                            tabbar: {
                                icon: icons.heart,
                            },
                            showMoreSection: true
                        }}
                        categoriesTabsShow={true}
                    />
                </UiTabPage>
                <UiTabPage index={tabs.indexByValue.popular} lazy>
                    <CatalogProducts
                        tab={{
                            title: 'Популярное',
                            code: 'popular',
                            type: 'page',
                            listOptions: {},
                            tabbar: {
                                icon: icons.heart,
                            },
                            showMoreSection: true
                        }}
                        elements={catalog.popularProducts}
                        categoriesTabsShow={true}
                    />
                </UiTabPage>
            </View>

        </UiTabController>

    </UiScreen>
})

const styles = StyleSheet.create({
    historyItem: {
        //flex: 1,
        alignSelf: 'center',
    },
    historyItemContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
    }
})


export default SearchScreen

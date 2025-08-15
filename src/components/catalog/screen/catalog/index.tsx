import React, {ReactNode, useCallback, useEffect, useMemo, useRef, useState} from "react"
import {BackHandler, LayoutChangeEvent, NativeScrollEvent, NativeSyntheticEvent, SafeAreaView} from "react-native"
import {Text, View} from "react-native-ui-lib"
import {observer} from "mobx-react"
import {useFocusEffect, useLocalSearchParams} from "expo-router"

import {useServices} from "~services"
import {useStores} from "~stores"
import {useSafeAreaInsets} from "react-native-safe-area-context"
import {TIconRender, TMaybe, TScreenProps, TScrollState} from "@core/main/types"
import {CatalogSection} from "~com/catalog/list/section"
import icons from "~assets/icons-map";
import {COLORS, SPACE, THEME_COLORS, TYPOGRAPHY, wWidth} from "~assets/design";
import Reanimated, {interpolate, useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import {MainTab} from "./main-tab";
import {TCatalogTab, TCatalogTabState} from "@core/catalog/types";
import {CatalogProducts} from "~com/catalog/list/products";
import {NavigationState, SceneMap, SceneRendererProps, TabBar, TabView} from '~ui/tab-view';
import {CatalogProductsFav} from "~com/catalog/list/products-fav";
import {UiLoading} from "~ui/loading";
import CatalogConstructorSection from "~com/catalog/constructor/section";
import AppConfig from "@core/main/config";
import {CATALOG_TABBAR_BG_COLOR, styles} from "./index.styles";
import {useStateRef} from "@core/main/lib/hooks/useStateRef";
import {useRefSet} from "@core/main/lib/hooks/useRefSet";
import {UiBtn} from "~ui/btn";
import {useDebounceCallback} from "@core/main/lib/hooks/useDebounceCallback";
import {UiImage} from "~ui/image";
import {ImageSource} from "expo-image/src/Image.types";
import {useDebouncedCallback} from "use-debounce";
import {verticalScale} from "@core/main/lib/scale";
import {TabBarStandalone} from "~ui/tab-view/TabBarStandalone";
import {CatalogSectionTabPublicApi} from "~com/catalog/list/index.hooks";
import {TabViewChangeTabInitiator} from "~ui/tab-view/TabView";
import usePage from "@core/page/hooks/usePage";
import {TTabControllerItemProps} from "~ui/tabs";

type State = NavigationState<{
    key: string;
    title: string;
}>

type TabViewChangeTabInitiatorCustom = TabViewChangeTabInitiator | 'back'

export const CatalogScreen: React.FC<TScreenProps> = observer(({}) => {

    const {
        catalog,
        sectionsDialog,
        router,
        app
    } = useStores()

    const {bus, imager} = useServices()

    const sections = catalog.rootSections

    const {
        chunks: {
            options,
            tabOptions,
            tabListOptions,
            tabWokOptions
        }
    } = usePage<
        {
            options: {
                showFavTab: boolean,
                showPopularTab: boolean,
                showSpecialTab: boolean,
            },
            tabOptions: {
                showNextTab: boolean,
            },
            tabWokOptions: {
                showBuilds: boolean,
            },
            tabListOptions: {
                allowGrouping: boolean,
                scrollTopOnCurrent: boolean
            }
        }
    >({
        path: AppConfig.APP_FRONT_PAGE,
        defaults: {
            options: {
                showFavTab: true,
                showPopularTab: false,
                showSpecialTab: true,
            },
            tabOptions: {
                showNextTab: true,
            },
            tabWokOptions: {
                showBuilds: true,
            },
            tabListOptions: {
                allowGrouping: false,
                scrollTopOnCurrent: false
            }
        },
    })

    const insets = useSafeAreaInsets()

    const routeParams: any = useLocalSearchParams()
    const routeParamsRef = useRefSet<any>(routeParams)

    const tabsRefs = useRef<Record<string, CatalogSectionTabPublicApi | null>>({})

    const [loading, setLoading, loadingRef, updateLoading] = useStateRef<boolean>(true)

    const [currentTabIsFront, , currentTabIsFrontRef, updateCurrentTabIsFront] = useStateRef(true)
    const [currentTabCode, , currentTabCodeRef, updateCurrentTabCode] = useStateRef('front')
    const [currentTabIndex, , currentTabIndexRef, updateCurrentTabIndex] = useStateRef(0);

    const prevTabCode = useRef<string>()

    const tabsHistory = useRef(['front'])

    const [swipeEnable, setSwipeEnable, swipeEnableRef, updateSwipeEnable] = useStateRef(false)

    const [tabbarContainerHeight, setTabbarContainerHeight] = useState<number>(45)
    const tabbarContainerRef = useRef<Reanimated.View>(null)

    const [searchContainerHeight, setSearchContainerHeight] = useState<number>(0)

    const tabbarShow = useSharedValue(0)
    const headerExpanded = useSharedValue(1)
    const menuButtonVisible = useSharedValue(0)

    const tabsHistoryPush = (code: string) => {

        if (code === 'front') {
            tabsHistory.current = ['front']
        } else {
            tabsHistory.current.push(code)
        }
    }

    const tabsList = useMemo<TCatalogTab[]>(() => {

        let items: TCatalogTab[] = []

        items.push({
            title: 'Главная',
            code: 'front',
            type: 'page',
            tabbar: {
                icon: (params) => renderSvgIcon({icon: icons.home, ...params}),
            },
            listOptions: {}
        })

        if (options.showFavTab) {
            items.push({
                title: 'Избранное',
                code: 'fav',
                type: 'page',
                listOptions: tabListOptions,
                tabbar: {
                    //title: 'Избранное',
                    icon: (params) => renderSvgIcon({icon: icons.heart, ...params}),
                }
            })
        }

        if (options.showPopularTab) {
            items.push({
                title: 'Популярное',
                code: 'popular',
                type: 'page',
                listOptions: tabListOptions,
                tabbar: {
                    //title: 'Популярное',
                    icon: (params) => renderSvgIcon({icon: icons.star, ...params}),
                }
            })
        }

        sections.forEach((section, index) => {

            if (!catalog.productsBySection[section.ID] || !catalog.productsBySection[section.ID].length)
                return;

            let tabTitle = section.propValue.MENU_TITLE || section.NAME

            const tab: TCatalogTab = {
                title: section.NAME,
                code: 'section-' + section.ID,
                type: 'section',
                entityId: section.ID,
                section: section,
                tabbar: {
                    title: tabTitle,
                    inactiveColor: section.propValue.MENU_COLOR,
                    bgColor: section.propValue.MENU_BG_COLOR,
                },
                listOptions: {
                    ...tabListOptions
                },
            }

            const menuIconSrc = imager.resolve(section.propValue.MENU_ICON, 100, true)
            const menuIconActiveSrc = imager.resolve(section.propValue.MENU_FOCUSED_ICON, 100, true)

            if (menuIconSrc || menuIconActiveSrc) {
                tab.tabbar.icon = (params) => renderImgIcon({
                    icon: menuIconSrc,
                    iconFocused: menuIconActiveSrc,
                    ...params
                })
            }

            const childSections = section.CHILDREN.filter(item => catalog.productsBySection[item.ID] && !!catalog.productsBySection[item.ID].length)

            if (childSections.length) {

                tab.tabs = childSections.map((childSection, index) => {
                    return {
                        title: childSection.NAME,
                        code: 'section-' + childSection.ID,
                        type: 'section',
                        entityId: childSection.ID,
                        section: childSection,
                        tabbar: {
                            title: childSection.propValue.MENU_TITLE || childSection.NAME,
                        },
                        listOptions: {
                            ...tabListOptions
                        }
                    }
                })

                tab.tabs.unshift({
                    title: 'Все',
                    code: 'all',
                    type: 'section',
                    entityId: 0,
                    tabbar: {
                        title: 'Все',
                    },
                    listOptions: {
                        ...tabListOptions
                    }
                })

                tab.tabsItems = tab.tabs.map((item) => ({
                    label: item.tabbar.title,
                    value: item.entityId
                } as TTabControllerItemProps))
            }

            items.push(tab)
        })

        if (catalog.requiredPriceProducts.length)
            items.push({
                title: 'Спец. предложения',
                code: 'special',
                type: 'page',
                listOptions: {
                    ...tabListOptions
                },
                tabbar: {
                    title: 'Спец. предложения'
                }
            })

        const lastTab = items[items.length - 1]

        if (lastTab) {
            lastTab.tabbar.title = lastTab.tabbar.title + SPACE.repeat(10)
        }

        return items
    }, [])

    const tabsByCode = useMemo(() => {
        return tabsList.reduce<Record<string, TCatalogTab>>((map, tab) => {
            map[tab.code] = tab
            return map
        }, {})
    }, [tabsList.length])

    const currentTab = tabsByCode[currentTabCode]

    const setTabbarContainerHeightDebounced = useDebouncedCallback((height: number) => {
        if (tabbarContainerHeight !== height)
            setTabbarContainerHeight(height)
    }, 300)

    const onChangeTab = useCallback((tab: TCatalogTab, index: number, initiator: TabViewChangeTabInitiatorCustom) => {

        const isFront = tab.code === 'front'

        if (currentTabIsFrontRef.current !== isFront) {
            setTimeout(() => {
                tabbarShow.value = withTiming(isFront ? 0 : 1, {duration: 250})
            }, 80)
        }

        prevTabCode.current = currentTabCodeRef.current

        if (initiator !== 'back' && prevTabCode.current) {
            tabsHistoryPush(prevTabCode.current)
        }

        updateCurrentTabIsFront(isFront)
        updateCurrentTabCode(tab.code)

        bus.emitter.emit('screen.catalog.change-tab-section', tab)

        if (!isFront) {
            updateSwipeEnable(true)
        } else {
            setTimeout(() => {
                updateSwipeEnable(false)
            }, 500)
            scrollToAction('front', 'top')
        }
    }, [tabsHistory])

    const scrollToAction = useCallback((tabCode: TMaybe<string>, scrollTo: TMaybe<string>) => {
        bus.emitter.emit('screen:catalog:tab.' + tabCode + '.scrollTo', scrollTo)
    }, [])

    const navTab = useCallback((tabCode?: TMaybe<string>, scrollTo?: TMaybe<string>, initiator?: TabViewChangeTabInitiatorCustom) => {

        let tabIndex: number = -1

        if (tabCode) {
            switch (tabCode) {
                case 'menu':
                    tabCode = 'front'
                    scrollTo = 'menu'
                    break;
                case 'index':
                case 'front':
                    tabCode = 'front'
                    break;
            }
            if (tabCode)
                tabIndex = tabsList.findIndex((item) => {
                    return item.code === tabCode
                })
        } else {
            tabIndex = currentTabIndexRef.current
            tabCode = tabsList[tabIndex] ? tabsList[tabIndex].code : null
        }


        if (tabIndex < 0)
            return;

        const scroll = () => {
            if (scrollTo) {
                if (currentTabIndexRef.current !== tabIndex) {
                    setTimeout(() => scrollToAction(tabCode, scrollTo), 300)
                } else {
                    scrollToAction(tabCode, scrollTo)
                }
            }
        }

        if (currentTabIndexRef.current !== tabIndex) {

            const tab = tabsList[tabIndex]
            if (tab) {

                prevTabCode.current = currentTabCode

                if (!swipeEnableRef.current) {
                    updateSwipeEnable(true)
                    setTimeout(() => {
                        updateCurrentTabIndex(tabIndex)
                        scroll()
                        setTimeout(() => {
                            onChangeTab(tab, tabIndex, initiator || 'api')
                        }, 500)
                    }, 50)
                } else {
                    updateCurrentTabIndex(tabIndex)
                    scroll()
                    setTimeout(() => {
                        onChangeTab(tab, tabIndex, initiator || 'api')
                    }, 500)
                }
            }
        } else {
            scroll()
        }
    }, [])

    const onCatalogScroll = useCallback((state: TScrollState) => {
        if (state.direction === 'up') {
            if (state.directionOffset > 100)
                headerExpanded.value = withTiming(1, {duration: 300})
        } else {
            if (state.directionOffset > 100)
                headerExpanded.value = withTiming(0, {duration: 300})
        }
    }, [])

    const routerBack = useCallback(() => {
        if (tabsHistory.current.length > 1) {
            let lastTab
            while (lastTab = tabsHistory.current.pop()) {
                if (lastTab !== currentTabCode) {
                    break;
                }
            }
            if (lastTab) {
                navTab(lastTab, null, 'back')
            }
        } else {
            tabsHistory.current = ['front']
            navTab('front', null, 'back')
        }
        return true
    }, [])

    useEffect(useCallback(() => {

        bus.on('catalog.scroll', onCatalogScroll)
        bus.on('screen.catalog.nav-tab', navTab)

        //bus.on('catalog.swipe.disable', onCatalogSwipeDisable)
        //bus.on('catalog.swipe.enable', onCatalogSwipeEnable)

        return () => {

            bus.off('catalog.scroll', onCatalogScroll)
            bus.off('screen.catalog.nav-tab', navTab)

            //bus.off('catalog.swipe.disable', onCatalogSwipeDisable)
            //bus.off('catalog.swipe.enable', onCatalogSwipeEnable)
        }
    }, []), [])

    useFocusEffect(useCallback(() => {

        const from = router.getAdditionalParam('form')

        router.setAdditionalParam('form', null)

        if (from === 'basket') {
            return
        }

        setTimeout(() => {
            router.alertsQueueShow()
        }, 500)

        if (!router.isFrontLoaded) {
            router.setIsFrontLoaded()
        }

        const params = routeParamsRef.current
        const paramsTab = params.tab
        const paramsScrollTo = params.scrollTo

        if (!paramsTab) {

            if (loadingRef.current) {
                setTimeout(() => {
                    setLoading(false)
                    setTimeout(() => {
                        //navTab('section-2')
                    }, 100)
                }, 1500);
            }

        } else {

            router.setParams({
                tab: ''
            })

            console.log('FRONT params', {
                paramsTab,
                paramsScrollTo
            })

            if (loadingRef.current) {
                setTimeout(() => {
                    updateLoading(false)
                    navTab(paramsTab, paramsScrollTo)
                }, 1500)
            } else {
                setTimeout(() => {
                    navTab(paramsTab, paramsScrollTo)
                }, 100)
            }
        }

        const backHandler = BackHandler.addEventListener('hardwareBackPress', routerBack)

        return () => {
            backHandler.remove()
        }
    }, []))


    const tabbarIndicatorColor = currentTab?.tabbar?.bgColor || THEME_COLORS.primary

    const [tabsState, setTabsState] = useState(() => {
        return tabsList.reduce<Record<string, TCatalogTabState>>((map, item) => {
            map[item.code] = {
                activeSection: 0
            }
            return map
        }, {})
    })

    const currentTabState = tabsState[currentTabCode]

    const tabsContent = useMemo(() => {

        let res: Record<string, ReactNode> = {}

        res.front = <MainTab
            tab={tabsByCode.front}
            navTab={navTab}
        />

        if (tabsByCode.fav)
            res.fav = <CatalogProductsFav
                tab={tabsByCode.fav}
            />

        if (tabsByCode.popular)
            res.popular = <CatalogProducts
                tab={tabsByCode.popular}
                viewMode={'grid'}
                elements={catalog.popularProducts}
            />

        sections.forEach((section, index) => {

            const code = 'section-' + section.ID

            if (!tabsByCode[code])
                return;

            const nextSection = sections[index + 1]

            let sectionsRendered

            switch (section.CODE) {
                case 'lapsha-i-ris':
                    sectionsRendered = <CatalogConstructorSection {...tabWokOptions}/>
                    break
                default:
                    sectionsRendered = <CatalogSection
                        ref={(r) => tabsRefs.current['section-' + section.ID] = r}
                        tab={tabsByCode[code]}
                        state={tabsState[code]}
                        section={section}
                        nextSection={tabOptions.showNextTab ? nextSection : undefined}
                        products={catalog.productsBySection[section.ID] || []}
                        onNext={() => {
                            if (nextSection)
                                navTab('section-' + nextSection.ID)
                        }}
                        onFilter={(filter) => {

                            const sectionId = filter.category

                            setTabsState({
                                ...tabsState,
                                [code]: {
                                    ...tabsState[code],
                                    activeSection: sectionId,
                                }
                            })
                        }}
                    />
            }

            res[code] = sectionsRendered
        })

        if (tabsByCode.special)
            res.special = <CatalogProducts
                tab={tabsByCode.special}
                elements={catalog.requiredPriceProducts}
            />

        return res
    }, [])

    const tabsScene = useMemo(() => {
        return SceneMap(tabsList.reduce<Record<string, () => ReactNode>>((map, tab) => {
            map[tab.code] = () => tabsContent[tab.code]
            return map
        }, {}))
    }, [tabsContent])

    const tabsRoutes = useMemo(() => {
        return tabsList.map(tab => ({
            key: tab.code,
            inactiveColor: tab.tabbar.inactiveColor,
            ...tab,
            title: tab.tabbar.title,
        }))
    }, [tabsList.length])


    const tabbarAnimatedStyles = useAnimatedStyle(() => {
        return {
            opacity: tabbarShow.value,
            marginTop: interpolate(
                tabbarShow.value,
                [0, 1],
                [-tabbarContainerHeight, 0],
            )
        };
    }, [tabbarContainerHeight]);

    const tabbarScroll = useDebounceCallback((x: number) => {
        menuButtonVisible.value = withTiming(x > 300 ? 1 : 0, {duration: 300})
    }, 70)

    const onTabbarScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
        tabbarScroll(e.nativeEvent.contentOffset.x)
    }, [])

    const onTabPressed = useDebounceCallback((tabInfo: TCatalogTab) => {
        bus.emitter.emit('screen.catalog.tab-pressed', tabInfo)
    }, 100)

    const onTabPress = useCallback((scene: any) => {
        const routeKey = scene.route.key
        setTimeout(() => {
            const tabIndex = tabsList.findIndex((item) => {
                return item.code === routeKey
            })
            const tabInfo = tabsList[tabIndex]
            onTabPressed(tabInfo)
        }, 10)
    }, [tabsList])

    const tabbarRightRendered = useMemo(() => {
        return <View
            reanimated absR absT absB centerV
            style={[
                {
                    zIndex: 100,
                    backgroundColor: CATALOG_TABBAR_BG_COLOR,
                },
                //menuButtonStyleAnimated
            ]}
        >
            <UiBtn
                icon={icons.bars}
                iconSize={verticalScale(26)}
                link={true}
                color={COLORS.primary}
                onPress={() => sectionsDialog.show()}
                paddingH-7
                paddingV-0
            />
        </View>
    }, [])

    const tabbarSecondaryRendered = useMemo(() => {

        if (currentTab.tabsItems && currentTab.tabsItems.length) {
            const activeSectionId = tabsState[currentTabCode].activeSection
            const activeSectionIndex = currentTab.tabsItems.findIndex(item => item.value === activeSectionId)

            return <View paddingH-10>
                <TabBarStandalone
                    items={currentTab.tabsItems}
                    activeIndex={activeSectionIndex}
                    onTabPress={(scene) => {
                        const sectionId = parseInt(scene.route.key)
                        setTabsState({
                            ...tabsState,
                            [currentTabCode]: {
                                ...tabsState[currentTabCode],
                                activeSection: sectionId,
                            }
                        })
                        tabsRefs.current[currentTabCode]?.setSection(sectionId)
                    }}
                    scrollEnabled={true}
                    style={{
                        backgroundColor: CATALOG_TABBAR_BG_COLOR,
                        elevation: 0,
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
                    //renderTabBarItem={}
                    activeColor={COLORS.primary}
                    inactiveColor={COLORS.grey20}
                    indicatorStyle={{
                        backgroundColor: COLORS.primary
                    }}
                />
            </View>
        }

    }, [currentTabCode, currentTabState])

    const tabbarContainerOnLayout = useCallback((event: LayoutChangeEvent) => {
        tabbarContainerRef.current?.measure((x, y, width, height, pageX, pageY) => {
            setTabbarContainerHeightDebounced(height)
        })
    }, [setTabbarContainerHeightDebounced])

    const tabbarRender = useCallback((props: SceneRendererProps & { navigationState: State }) => {
        return <Reanimated.View
            style={styles.header}
            onLayout={tabbarContainerOnLayout}
            ref={tabbarContainerRef}
        >
            <View
                row
                centerV
                marginT-6
                style={styles.headerInner}
            >
                <View flexG style={{}}>
                    <TabBar
                        {...props}
                        scrollEnabled={true}
                        indicatorStyle={[
                            currentTabIsFront ?
                                styles.tabbarIndicatorLight
                                : {
                                    ...styles.tabbarIndicator,
                                    backgroundColor: tabbarIndicatorColor
                                }
                        ]}

                        indicatorContainerStyle={styles.indicatorContainerStyle}
                        style={styles.tabbar}
                        tabStyle={styles.tabbarTab}
                        labelStyle={styles.tabbarLabel}
                        activeColor={currentTabIsFront ? COLORS.primary : COLORS.white}
                        inactiveColor={COLORS.grey20}
                        renderIcon={renderIcon as any}
                        onScroll={onTabbarScroll}
                        onTabPress={onTabPress}
                    />
                </View>
                {tabbarRightRendered}
            </View>
        </Reanimated.View>
    }, [currentTabIsFront, searchContainerHeight, tabbarIndicatorColor, tabbarRightRendered, tabbarContainerOnLayout])

    const onChangeTabIndex = useCallback((newIndex: number) => {
        updateCurrentTabIndex(newIndex)
        tabsList[currentTabIndex] && onChangeTab(tabsList[newIndex], newIndex, 'user')
    }, [tabsList.length])

    const onSwipeStart = useCallback(() => {
        catalog.disableOpen('swipe')
    }, [])

    const onSwipeEnd = useCallback(() => {
        catalog.enableOpen()
    }, [])

    return <SafeAreaView
        style={[
            styles.mainContainer,
            {
                marginTop: insets.top,
                overflow: 'hidden'
            }
        ]}
    >
        {loading && <UiLoading
            preset={'fullscreen'}
            opacity={1}
        />}

        {
            <TabView
                renderTabBar={tabbarRender as any}
                tabBarAppend={tabbarSecondaryRendered}
                navigationState={{index: currentTabIndex, routes: tabsRoutes}}
                renderScene={tabsScene}
                onIndexChange={onChangeTabIndex}
                initialLayout={{width: wWidth}}
                lazy={true}
                lazyPreloadDistance={3}
                swipeEnabled={swipeEnable}
                onSwipeStart={onSwipeStart}
                onSwipeEnd={onSwipeEnd}
            />
        }

        <View
            style={{display: 'none', position: 'absolute', bottom: 0, left: 0, width: '100%'}}
            paddingH-16
            paddingB-10
        >
            <View
                bg-black
                style={{
                    backgroundColor: COLORS.colorAspid,
                    borderRadius: 12
                }}
                paddingH-10
                paddingV-5
            >
                <Text white>200 руб до бесплатной доставки</Text>
            </View>
        </View>

    </SafeAreaView>
})

type TIconRenderParams = {
    icon: TIconRender | ImageSource | string,
    iconFocused?: TIconRender | ImageSource | string,
    focused: boolean,
    color: string,
    size: number
}

const renderIcon = ({route, focused, color}: {
    route: TCatalogTab,
    focused: boolean,
    color: string
}) => {
    if (route.tabbar?.icon) {
        return <View paddingH-3>{route.tabbar?.icon({
            color,
            focused,
            size: 20
        })}</View>
    }
}

const renderSvgIcon = (
    {
        icon,
        iconFocused,
        focused,
        color,
        size
    }: TIconRenderParams) => {
    const _icon = (focused && iconFocused ? iconFocused : icon) as TIconRender
    return _icon({size, color})
}

const renderImgIcon = (
    {
        icon,
        iconFocused,
        focused,
        color,
        size
    }: TIconRenderParams) => {
    const _icon = (focused && iconFocused ? iconFocused : icon) as string
    return <UiImage source={{uri: _icon}} contentFit={'contain'} style={{width: size, height: size}}/>
}

export default CatalogScreen


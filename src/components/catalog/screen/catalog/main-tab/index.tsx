import {Colors, Text, View} from "react-native-ui-lib";
import {COLORS, wWidth} from "~assets/design";
import {Boubles} from "./blocks/boubles";
import icons from "~assets/icons-map";
import {UiTextField} from "~ui/text-field";
import {OffersCommonSlider, OffersCommonSliderProps} from "~com/offer/common-slider";
import {OffersIndividualSlider, OffersIndividualSliderProps} from "~com/offer/individual-slider";
import {CatalogMenu, TCatalogMenuProps} from "~com/catalog/menu";
import {ScrollView, StyleSheet} from "react-native";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {useStores} from "~stores";
import {useFocusEffect} from "expo-router";
import {observer, useLocalObservable} from "mobx-react";
import {TCatalogTab} from "@core/catalog/types";
import {CatalogProductsSlider, CatalogProductsSliderProps} from "~com/catalog/list/prodcts-slider";
import {UiCard, UiCardProps} from "~ui/card";
import {ContentBuilder} from "~ui/content-builder/Builder";
import {UiContentBuilder} from "~ui/content-builder/BuilderRender";
import {PartialWithKey} from "@core/main/types";
import {useServices} from "~services";
import {useScrollView} from "@core/main/lib/hooks/useScrollView";
import {OrderModel} from "@core/sale/model/Order";
import {UiBtn} from "~ui/btn";
import CatalogConfig from "@core/catalog/config";
import {useIsFrontPage} from "@core/main/lib/hooks/useIsFrontPage";
import AppConfig from "@core/main/config";
import {useWatch} from "@core/main/lib/hooks/useWatch";
import {UserBonusesCard} from "~com/user/cards/bonuses";

type TProps = {
    tab: TCatalogTab,
    navTab?: any
}

const MainTabComponent: React.FC<TProps> = (props) => {

    const {
        catalog,
        sale,
        offer,
        user,
        page,
        fav,
        deliveryEditDialog,
    } = useStores()

    const currentPage = page.getPageByPath(CatalogConfig.CATALOG_SCREEN_URL)
    const pageChunks = currentPage?.chunk || {}
    const pageChunkTab = pageChunks.tabMain || {}

    const layoutSchema = pageChunkTab.layout?.schema

    const tabOptions = {
        userBoxSideSuggestions: ['activeOrder', 'delivery', 'catalog'],
        ...pageChunkTab.options,
    }

    const [screenVisible, setScreenVisible] = useState(false)
    const [scrollToState, setScrollToState] = useState<string | null>(null)

    const {vorder, router} = useStores()

    const {imager, bus} = useServices()

    const refs = {
        scroll: React.useRef<ScrollView>(null),
        anchors: React.useRef<any>({}),
    }

    const scrollView = useScrollView(refs.scroll)
    const isFrontPage = useIsFrontPage()

    const scrollToCommit = (name: string) => {
        if (name === 'top') {
            refs.scroll.current?.scrollTo({y: 0})
        } else {
            scrollView.scrollToView(refs.anchors.current[name])
        }
    }

    const scrollTo = (name: string, routerNav?: boolean) => {
        console.log('scrollTo', name)
        if (isFrontPage) {
            scrollToCommit(name)
        } else {
            setScrollToState(name)
            if (routerNav) {
                router.push(AppConfig.APP_FRONT_PAGE)
            }
        }
    }

    useEffect(() => {
        bus.emitter.on('screen:catalog:tab.front.scrollTo', scrollTo)
        return () => {
            bus.emitter.off('screen:catalog:tab.front.scrollTo', scrollTo)
        }
    }, [])

    useFocusEffect(useCallback(() => {
        layoutBuilder.setSchemaIfNeed(layoutSchema)
        setScreenVisible(true)
        if (scrollToState) {
            setScrollToState(null)
            scrollToCommit(scrollToState)
        }
        return () => {
            setScrollToState(null)
            setScreenVisible(false)
        }
    }, []))

    const renderUserBoxOrder = useCallback((order: OrderModel) => {
        return <View gap-6>
            <Text text-sm-lh0 center>{order.deliveryTimeView}</Text>
            <View
                paddingH-5
                paddingV-5
                center
                br-sm
                bg-secondary
            >
                <Text
                    text-xs-m-lh0
                    white
                    center
                >{order.CSTATUS_NAME}</Text>
            </View>
        </View>
    }, [])


    const userSideBox = useMemo<UiCardProps | null>(() => {

            let res: UiCardProps | null = null

            for (const suggestion of tabOptions.userBoxSideSuggestions) {

                switch (suggestion) {
                    case 'activeOrder':
                        if (sale.userOrdersActive.length) {
                            const order = sale.userOrdersActive[0]
                            res = {
                                title: 'Активный заказ',
                                children: renderUserBoxOrder(order),
                                onPress: () => router.push({pathname: '/user/order', params: {orderId: order.ID}})
                            }
                        }
                        break;
                    case 'delivery':
                        res = {
                            title: vorder.attrValue['DELIVERY_ID'] === 1 ? 'Адрес доставки' : 'Адрес самовывоза',
                            contentProps: {
                                flex: 1,
                                style: {flex: 1}
                            },
                            children: <View flex centerV>
                                {vorder.attrValue['DELIVERY_ID'] === 1 ?
                                    (vorder.profile ?
                                            <Text text-xs-m-lh0 colorAspid center numberOfLines={3}>
                                                {vorder.profile.getAddressForView('city', false)}
                                            </Text>
                                            :
                                            <Text text-xs-m-lh0 center>
                                                выберите адрес
                                            </Text>
                                    )
                                    :
                                    (vorder.pickupDepartmentElement ?
                                            <Text text-xxs-m-lh0 center colorAspid>
                                                {vorder.pickupDepartmentElement.NAME}
                                            </Text>
                                            :
                                            <Text text-xs-m-lh0 center>
                                                выберите подразделение
                                            </Text>
                                    )
                                }
                            </View>,
                            onPress: () => deliveryEditDialog.open({profile: vorder.profile})
                        }
                        break;
                    case 'hottestOffer':
                        if (offer.hottestOffer) {
                            res = {
                                containerProps: {
                                    style: {
                                        justifyContent: 'center',
                                        backgroundColor: '#37A0D1'
                                    }
                                },
                                children: <Text center white>
                                    {offer.hottestOffer?.getTemplatedReact('NAME',
                                        (v) => <Text bold-8 key={1} white>{v}</Text>
                                    )}
                                </Text>
                            }
                        }
                        break;
                    case 'catalog':
                        res = {
                            contentProps: {
                                style: {
                                    marginTop: 'auto',
                                    marginBottom: 'auto',
                                }
                            },
                            children: <UiBtn
                                center
                                link
                                avoidMinWidth={true}
                                labelProps={{
                                    numberOfLines: 2,
                                    center: true
                                }}
                                action={{url: 'catalog://menu'}}
                                text-md-m
                                primary
                                label={'Перейти в каталог'}
                            />
                        }
                        break;
                }

                if (res)
                    break;
            }
            return res
        },
        [
            sale.userOrdersActiveHash,
            vorder.attrValue['DELIVERY_ID'],
            vorder.attrValue['PICKUP_DEPARTMENT'],
            vorder.addressFull,
            vorder.profile,
        ]
    )

    const coms = {
        bonuses: () => <UserBonusesCard key={'bonuses'}/>,

        sideBox: () => !!userSideBox && <UiCard
            preset={'frontUser'}
            flex
            titleProps={{
                center: true
            }}
            {...userSideBox}
            key={'sideBox'}
        />,

        offersIndividual: (p: PartialWithKey<OffersIndividualSliderProps> = {}) =>
            !!offer.offersOnFront.length &&
            <OffersIndividualSlider
                offers={offer.offersOnFront}
                {...p}
                key={'offersIndividual'}
            />
        ,

        offersCommon: (p: PartialWithKey<OffersCommonSliderProps> = {}) =>
            !!offer.commonOffersSorted.length &&
            <OffersCommonSlider
                items={offer.commonOffersSorted}
                {...p}
                key={'offersCommon'}
            />,

        popular: (p: PartialWithKey<CatalogProductsSliderProps> = {}) =>
            !!catalog.popularProductsShort.length &&
            <CatalogProductsSlider
                products={catalog.popularProductsShort}
                excludeFlags={['hit']}
                {...p}
                key={'popular'}
            />,

        fav: (p: PartialWithKey<CatalogProductsSliderProps> = {}) =>
            fav.products.length &&
            <CatalogProductsSlider
                products={fav.products}
                excludeFlags={['fav']}
                {...p}
                key={'fav'}
            />,

        menu: (p: PartialWithKey<TCatalogMenuProps> = {}) =>
            <CatalogMenu
                items={catalog.menuItems}
                marginH-7
                {...p}
                key={'menu'}
            />,

        special: (p: PartialWithKey<CatalogProductsSliderProps> = {}) =>
            !!catalog.requiredPriceProducts.length &&
            <CatalogProductsSlider
                products={catalog.requiredPriceProducts}
                {...p}
                key={'special'}
            />
    }

    const data = {}

    const layoutBuilder = useLocalObservable(() => new ContentBuilder({
        components: coms,
        data: data,
        schema: layoutSchema,
        refs: refs.anchors
    }))

    useWatch(() => {
        layoutBuilder.setComponent('sideBox', coms.sideBox)
    }, [userSideBox])

    const isAuthorized = user.isAuthorized

    const headerBig = offer.offersOnFront.length || isAuthorized

    return <ScrollView
        style={{backgroundColor: '#FFFFFF'}}
        ref={refs.scroll}
        onScroll={scrollView.onScroll}
        scrollEventThrottle={100}
    >
        <View
            style={{
                backgroundColor: COLORS.primary,
                height: headerBig ? 160 : 130,
                width: '100%',
                position: 'absolute'
            }}
        >
            {screenVisible && <Boubles
                width={wWidth}
                height={160}
            />}
        </View>

        <View gap-12 marginT-15 paddingH-screenH>
            <View row gap-16 centerV>
                <View>
                    <icons.logo
                        color={Colors.white}
                        width={93}
                        height={32}
                    />
                </View>
                <View flexS>
                    <Text
                        text-lg-m
                        numberOfLines={2}
                        ellipsizeMode={'clip'}
                        white
                    >Привет, {user.user?.GREETING_NAME || 'Гость'}!</Text>
                </View>
            </View>
            <View
                style={{
                    borderRadius: 12
                }}
            >
                <UiTextField
                    presets={['outline', 'md']}
                    placeholder={'Поиск блюд'}
                    onPress={() => router.push('/catalog/search?focus=1')}
                    containerStyle={{
                        paddingVertical: 0
                    }}
                    fieldStyle={{
                        paddingVertical: 0
                    }}
                    placeholderTextColor={COLORS.grey40}
                />
            </View>
        </View>

        {!isAuthorized && <View marginB-15></View>}

        <UiContentBuilder
            builder={layoutBuilder}
            style={{
                marginTop: headerBig ? 16 : 25
            }}
        />

    </ScrollView>
}

export const MainTab = observer(MainTabComponent)

const styles = StyleSheet.create({});




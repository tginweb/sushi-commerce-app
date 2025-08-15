import React, {useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState} from "react"
import {StyleSheet} from "react-native"
import {observer} from "mobx-react"
import {TScreenProps} from "@core/main/types"
import {UiScreen} from "~ui/screen";
import {Carousel, Text, TextProps, TouchableOpacity, View} from "react-native-ui-lib"
import {COLORS, wWidth} from "~assets/design";
import {TDeliveryDetailView, TFilters, TMode, TTab} from "./types";
import icons, {CLOSER_BACK} from "~assets/icons-map";
import {useFocusEffect} from "expo-router";
import {Map} from "./components/map";
import {useStores} from "~stores";
import {useServices} from "~services";
import MapView from "react-native-maps";
import {useLayout} from "@core/main/lib/hooks/useLayout";
import {UiBottomSheet, UiBottomSheetMethods, useBottomSheetScope} from "~com//ui/bottom-sheet";
import {CompanyOfficeModel} from "@core/company/model/CompanyOffice";
import {LatLng} from "react-native-maps/lib/sharedTypes";
import {UiList} from "~ui/list";
import {UiImage} from "~ui/image";
import {UiSection} from "~ui/section";
import {UiSegments} from "~ui/segments";
import {TDeliveryZonePolygon, TDeliveryZoneView} from "@core/sale/types";
import {TOfficeDetailView, TOfficeView} from "@core/company/types";
import {useSafeAreaInsets} from "react-native-safe-area-context";

export const DeliveryScreen: React.FC<TScreenProps> = observer((p) => {

    const {sale, company, router} = useStores()
    const {linking} = useServices()

    const insets = useSafeAreaInsets()

    const refs = {
        container: useRef<any>(null),
        map: useRef<MapView | null>(null),
        listModal: useRef<UiBottomSheetMethods | null>(null),
        itemModal: useRef<UiBottomSheetMethods | null>(null),
        listRefs: useRef<any>({}),
    }

    const [tab, setTab] = useState<TTab>('delivery')
    const [isMounted, setIsMounted] = useState(false)

    const [filters, setFilters] = useState<TFilters>({worktime: false})

    const [selectedOfficeView, setSelectedOfficeView] = useState<TOfficeView>()
    const [selectedZoneView, setSelectedZoneView] = useState<TDeliveryZoneView>()

    const [needCalloutShow, setNeedCalloutShow] = useState(false)
    const [mode, setMode] = useState<'list' | 'item'>('list')
    const containerLayout = useLayout(refs.container, {testId: 'screen.delivery.container'})
    const layoutHeight = containerLayout.measure.height

    const [defaultCenter] = useState(() => sale.getDeliveryZonesCenter())
    const [mapZoomed, setMapZoomed] = useState(false)

    const initialRegion = useMemo(() => ({
        ...defaultCenter.getGoogleData(),
        latitudeDelta: 0.6,
        longitudeDelta: 0.6,
    }), [])

    const modalList = useBottomSheetScope({
        initialVisible: true,
        initialSnapIndex: 1,
        backstageHeightType: 'auto',
        snapPoints: [
            '25%',
            '50%',
            '82%',
        ]
    })

    const modalItem = useBottomSheetScope({
        autoHeight: true,
        initialVisible: false,
        initialSnapIndex: 0,
        backstageHeightType: 'auto',
        snapPoints: [
            '50%',
            '82%',
        ]
    })

    const zones = sale.deliveryZones

    const zonesPolygons = useMemo<TDeliveryZonePolygon[]>(() => {
        return zones.reduce((map: any, zone) => {
            map = [...map, ...zone.getPolygons(selectedZoneView?.entity)]
            return map
        }, [])
    }, [zones, selectedZoneView])


    const zoneViews = useMemo<TDeliveryZoneView[]>(() => {
        return zones.map(zone => {
            return {
                type: 'zone',
                id: zone.ID.toString(),
                entityId: zone.ID,
                entity: zone,
            }
        })
    }, [tab])

    const offices = useMemo<CompanyOfficeModel[]>(() => {
        return company.offices
            .filter(office => !!office.propValue.COORDINATES)
            .filter((office) => {
                if (tab === 'pickup') {
                    return office.ROLES && office.ROLES.includes('pickup')
                } else if (tab === 'bar') {
                    return office.ROLES && office.ROLES.includes('bar')
                } else if (tab === 'delivery') {
                    return false
                }
            })
    }, [tab])

    const officeViews = useMemo<TOfficeView[]>(() => {
        return offices.map(office => {
            return {
                type: 'office',
                id: office.ID.toString(),
                entityId: office.ID,
                entity: office,
                marker: office.coordinatesObject ? {
                    coordinate: office.coordinatesObject.getGoogleData(),
                    title: office.NAME,
                    description: office.propValue.WORKTIME,
                    isPreselected: true
                } : undefined,
            }
        })
    }, [tab])

    const officeMarkers = useRef<any>({})

    const selectedOfficeViewDetail = useMemo<TOfficeDetailView | null>(() => {

        if (!selectedOfficeView)
            return null

        const res: TDeliveryDetailView = {
            ...selectedOfficeView,
            fields: [],
            gallery: []
        }

        const element = selectedOfficeView.entity

        res.fields.push({
            label: element.NAME,
            icon: icons.nav,
            onPress: () => methods.officeNav(selectedOfficeView)
        })

        if (element.phoneToCall) {
            res.fields.push({
                label: element.phoneToCall,
                icon: icons.phone,
                onPress: () => linking.callPhone(element.phoneToCall)
            })
        }
        if (element.propValue.WORKTIME) {
            res.fields.push({
                label: 'Время работы',
                content: element.propValue.WORKTIME,
                icon: icons.clock,
            })
        }
        if (element.propValue.WORKTIME) {
            res.fields.push({
                label: 'Самовывоз',
                content: element.propValue.WORKTIME,
                icon: icons.deliveryPickup,
            })
        }

        //res.gallery = element.getGallery().map(item => ({uri: imager.resolve(item.SRC || '')}))

        return res
    }, [selectedOfficeView])

    useFocusEffect(useCallback(() => {
        return () => {
            setIsMounted(false)
            modalList.hide()
            modalItem.hide()
        }
    }, []))

    useEffect(() => {
        if (isMounted) {
            if (mode === 'item') {
                methods.openList()
            } else {
                if (!mapZoomed) {
                    if (tab === 'delivery') {
                        methods.mapNav(defaultCenter.getGoogleData(), 0.6)
                    } else {
                        methods.mapNav(defaultCenter.getGoogleData(), 0.2)
                    }
                }
            }
        }
        setIsMounted(true)
    }, [tab])

    useEffect(() => {
        if (selectedOfficeView) {
            if (officeMarkers.current[selectedOfficeView.entity.ID]) {
                if (needCalloutShow) {
                    officeMarkers.current[selectedOfficeView.entity.ID].showCallout()
                } else {
                    officeMarkers.current[selectedOfficeView.entity.ID].hideCallout()
                }
            }
        }
    }, [needCalloutShow])

    useLayoutEffect(() => {
        requestAnimationFrame(() => refs.listModal.current?.present());
    }, [])

    const methods = {
        toggleFilter(filterName: keyof TFilters) {
            setFilters((v) => ({...v, [filterName]: !v[filterName]}))
        },
        showGallery: () => {
            //if (selectedOfficeViewDetail) galleryDialog.show({items: selectedOfficeViewDetail?.gallery})
        },
        mapTouch: () => {
            if (mode == 'item') {
                refs.itemModal.current?.collapse()
            } else {
                if (modalList.snapIndex > 1)
                    modalList.setSnapIndex(1)
                //refs.listModal.current?.collapse()
            }
        },
        onMapZoom: () => {
            setMapZoomed(true)
        },
        onMapZoneClick: (zone: any) => {
            setSelectedZoneView(zone)
            //refs.listModal.current.scrollToView(refs.listRefs.current['zone-' + zone.entity.ID], true)
        },
        modeChange: (newMode: TMode) => {
            setMode(newMode)
        },
        officeNav: (view: TOfficeView, showCallout = false) => {
            if (view.marker && view.marker.coordinate) {
                methods.mapNav(view.marker.coordinate)
                if (showCallout)
                    setNeedCalloutShow(true)
            }
        },
        officeSelect: (view: TOfficeView, fromMap?: boolean) => {
            setSelectedOfficeView(view)
            modalList.hide()
            modalItem.show(0)
            methods.officeNav(view, !fromMap)
            methods.modeChange('item')
        },
        openList: async () => {
            modalItem.hide()
            modalList.show(1)
            setNeedCalloutShow(false)
            await methods.mapNav(defaultCenter.getGoogleData(), 0.2)
            methods.modeChange('list')
        },
        zoneSelect: (view: TDeliveryZoneView) => {
            setSelectedZoneView(view)
        },
        mapNav: async (coords: LatLng, delta = 0.015) => {
            const camera = await refs.map.current?.getCamera()
            if (camera) {
                refs.map.current?.animateToRegion({
                    ...coords,
                    latitudeDelta: delta,
                    longitudeDelta: delta
                }, 1000)
            }
        }
    }

    const tabsInfo: any = {
        delivery: {
            sheet: {
                title: 'Зоны доставки'
            }
        },
        pickup: {
            sheet: {
                title: 'Адреса самовывоза'
            }
        },
        bar: {
            sheet: {
                title: 'Суши бары'
            }
        }
    }

    const tabInfo = tabsInfo[tab]

    const renderList = useMemo(() => {

        const renderZoneItem = (view: TDeliveryZoneView) => {
            const entity = view.entity

            let descTextProps: TextProps = {}

            if (selectedZoneView?.entityId !== entity.ID) {
                descTextProps = {
                    ...descTextProps,
                    numberOfLines: 2
                }
            }

            return <TouchableOpacity
                paddingH-18
                paddingV-14
                key={view.entity.ID}
                style={[
                    styles.item,
                    {
                        backgroundColor: entity.PROP_COLOR || 'rgba(27, 173, 3, 0.7)'
                    },
                    view.entity === selectedZoneView?.entity ? styles.itemSelected : null
                ]}
                onPress={() => methods.zoneSelect(view)}
                ref={(r) => refs.listRefs.current['zone-' + entity.ID] = r}
            >
                <View>
                    <Text text-lg-m white>{entity.PROP_FREE_TEXT}</Text>
                </View>
                <View>
                    <Text
                        text-md-r-lh1
                        white
                        {...descTextProps}
                    >{entity.PREVIEW_TEXT}</Text>
                </View>
            </TouchableOpacity>
        }

        return <UiBottomSheet
            id={'tab-pickup-list'}
            isVisible={modalList.visible}
            onClose={modalList.hide}
            backdrop={false}
            autoHeight={false}
            closeOnRouterBack={false}
            snapPoints={modalList.snapPoints}
            snapIndex={modalList.snapIndex}
            onSnapIndexChange={modalList.setSnapIndex}
            ref={refs.listModal}
            closer={false}
            enablePanDownToClose={false}
            enableDismissOnClose={true}
            preset={'default'}
            stackBehavior={'replace'}
            topbarHide={true}
            {...tabInfo.sheet}
        >
            <View marginV-20>
                {
                    tab === 'delivery' ?
                        <View gap-10>
                            {zoneViews.map((view) => renderZoneItem(view))}
                        </View>
                        :
                        <UiList
                            items={officeViews.map(view => ({
                                label: view.entity.NAME,
                                content: view.entity.propValue.WORKTIME,
                                contentTextPreset: ['grey30', 'text-sm-lh0'],
                                onPress: () => methods.officeSelect(view)
                            }))}
                            preset={['menu']}
                            itemPreset={['menu2']}
                            itemProps={{
                                elementsStyle: {
                                    content: {
                                        width: 100
                                    }
                                }
                            }}
                        />
                }
            </View>
        </UiBottomSheet>
    }, [modalList.visible, modalList.snapIndex, tab, filters, selectedZoneView?.entityId])

    const renderOfficeContent = useMemo(() => {

        if (!selectedOfficeViewDetail) return <></>

        const schema: any = {
            0: {
                slider: {
                    pageWidth: wWidth / 3
                }
            },
            1: {
                slider: {
                    pageWidth: wWidth - 50
                }
            },
        }

        const itemTheme = schema[modalItem.snapIndex]

        return <View paddingV-modalV gap-16>
            {!!selectedOfficeViewDetail.gallery.length && (
                <View>
                    <Carousel
                        animated={true}
                        containerStyle={styles.carousel}
                        pagingEnabled={true}
                        itemSpacings={10}
                        containerMarginHorizontal={10}
                        {...itemTheme.slider}
                    >
                        {selectedOfficeViewDetail.gallery.map((image, index) => {
                            return <TouchableOpacity
                                key={index}
                                style={styles.slide}
                                onPress={methods.showGallery}
                            >
                                <UiImage
                                    source={image}
                                    vendor={'expo'}
                                    resizeMode={'contain'}
                                    style={styles.image}
                                    autoHeight={true}
                                    aspectRatio={2}
                                />
                            </TouchableOpacity>
                        })}
                    </Carousel>
                </View>
            )}
            <View paddingH-modalH>
                <UiSection
                    preset={['filled']}
                >
                    <UiList
                        itemPreset={['fields']}
                        items={selectedOfficeViewDetail?.fields || []}
                    />
                </UiSection>
            </View>
        </View>
    }, [selectedOfficeViewDetail, modalItem.snapIndex])

    const renderZoneContent = useMemo(() => {
        if (!selectedZoneView) return <></>
        return <View paddingV-modalV gap-16></View>
    }, [selectedOfficeViewDetail, modalItem.snapIndex])

    const renderItem = useMemo(() => {

        if (!selectedOfficeViewDetail) return null

        return <UiBottomSheet
            id={'tab-pickup-item'}
            isVisible={modalItem.visible}
            title={selectedOfficeViewDetail?.entity.roleName}
            backdrop={false}
            autoHeight={false}
            snapPoints={modalItem.snapPoints}
            onSizeChange={modalItem.onSizeChange}
            onCloseManual={() => {
                methods.openList()
            }}
            footerIsFixed={true}
            closeOnRouterBack={false}
            onSnapIndexChange={modalItem.setSnapIndex}
            enableDismissOnClose={true}
            enablePanDownToClose={true}
            titleHide={false}
            topbarBorderBottom={true}
            maxDynamicContentSize={300}
            targetModifiers={{
                // topbar: ['absR'],
                scroll: []
            }}
            ref={refs.itemModal}
            stackBehavior={'replace'}
            preset={'default'}
        >
            {
                tab !== 'delivery' ? renderOfficeContent : renderZoneContent
            }
        </UiBottomSheet>
    }, [
        selectedOfficeView,
        selectedZoneView,
        modalItem.visible,
        modalItem.snapIndex
    ])

    const renderHeader = () =>
        <View
            marginH-10
            marginT-10
            style={{
                zIndex: 20,
                marginTop: insets.top + 10
            }}
            row
            gap-10
            centerV
        >
            <View>
                {CLOSER_BACK({
                    size: 26,
                    onPress: () => {
                        console.log('BAAAK')
                        modalList.hide()
                        modalItem.hide()
                        router.back()
                    }
                })}
            </View>
            <View flexG>
                <UiSegments
                    initialValue={tab}
                    activeColor={COLORS.primary}
                    segments={[
                        {
                            value: 'delivery',
                            label: 'Доставка',
                        },
                        {
                            value: 'pickup',
                            label: 'Самовывоз',
                        },
                        {
                            value: 'bar',
                            label: 'Суши-бары',
                        },
                    ]}
                    onChangeValue={(v: TTab) => setTab(v)}
                />
            </View>
        </View>


    return <UiScreen
        headerSlotInner={renderHeader}
        headerAbsolute={true}
        bodyScroll={false}
        backgroundColor={'#FFFFFF'}
    >
        <View flex style={styles.container} ref={refs.container} onLayout={containerLayout.onLayout}>
            {!!layoutHeight && <Map
                initialRegion={initialRegion}
                layoutHeight={layoutHeight}
                offices={officeViews}
                zones={tab === 'delivery' ? zonesPolygons : undefined}
                selectedOffice={selectedOfficeView}
                onMapTouch={methods.mapTouch}
                onOfficeSelect={methods.officeSelect}
                onZoom={methods.onMapZoom}
                onZoneClick={methods.onMapZoneClick}
                markersRef={officeMarkers}
                ref={refs.map}
            />}

            {renderList}
            {renderItem}
        </View>
    </UiScreen>
})

const styles = StyleSheet.create({
    map: {
        width: '100%',
        height: 300,
    },
    item: {
        gap: 5,
        borderRadius: 20
    },
    officeItem: {},
    container: {
        //flex1: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollViewContentContainer: {
        paddingHorizontal: 16,
        paddingTop: 16
    },
    slide: {
        overflow: 'hidden',
        borderRadius: 20,
        flex: 1,
    },
    image: {
        width: '100%',
        height: undefined,
    },
    carousel: {},
    markerWrapper: {
        position: 'relative',
        shadowColor: '#000',
        shadowOffset: {
            width: 2,
            height: 4,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6,
    },
    marker: {
        position: 'absolute',
        top: 10,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },

    itemSelected: {
        borderWidth: 2,
        borderColor: COLORS.colorAspid,
    },
});

export default DeliveryScreen

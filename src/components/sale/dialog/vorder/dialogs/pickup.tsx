import React, {useCallback, useMemo, useRef, useState} from "react"
import {StyleSheet} from "react-native"
import {observer} from "mobx-react"
import {useStores} from "~stores"
import {TBottomSheetOnClose, UiBottomSheet} from "~com/ui/bottom-sheet";
import {Text, View} from "react-native-ui-lib";
import MapView from "react-native-maps";
import {GeoCoordinates} from "@core/geo/class/GeoCoordinates";
import {UiMessages} from "~ui/messages";
import {UiOptions} from "~ui/options";
import {COLORS, THEME_STYLE, wHeight} from "~assets/design";
import icons from "~assets/icons-map";
import {UiBtn, UiBtnProps} from "~ui/btn";
import {UiSegments} from "~ui/segments";
import {UiListItemProps} from "~ui/list-item";
import {useAnimatedReaction, useSharedValue} from "react-native-reanimated";
import {TOfficeView} from "@core/company/types";
import {MapDelivery} from "~com/geo/map-delivery";


export const VorderPickupDialog: React.FC = observer(() => {

    const {vorder, sale, company, geo} = useStores()
    const [mode, setMode] = useState<string>('list')
    const [nearestLoading, setNearestLoading] = useState<boolean>(false)

    const pickupDepartmentId = vorder.attrValue['PICKUP_DEPARTMENT']

    const initialPickupDepartmentRef = useRef<number>(pickupDepartmentId)

    const markersRef = useRef<any>({})

    const refs = {
        sheet: useRef<any>(null),
        map: useRef<MapView>(null as any),
        options: useRef<any>({}),
    }

    const modeOptions = useMemo<any>(() => {
        return [
            {
                label: 'Список',
                value: 'list'
            },
            {
                label: 'На карте',
                value: 'map'
            },
        ]
    }, [])

    // COMPUTED

    const officesViews = useMemo<TOfficeView[]>(() => {
        return company.offices.filter(office => !!office.propValue.COORDINATES).map(office => {
            const coords = new GeoCoordinates(office.propValue.COORDINATES, 'latlong')
            return {
                id: 'office:' + office.ID,
                type: 'office',
                marker: {
                    coordinate: coords.getPositionObject(true),
                    title: office.NAME,
                    description: office.propValue.WORKTIME,
                },
                entity: office,
                entityId: office.ID,
                coords
            } as TOfficeView
        })
    }, [])

    const selectedOfficeView = officesViews.find(office => office.entityId === pickupDepartmentId)

    // METHODS

    const onMapReady = () => {
        if (pickupDepartmentId) {
            const marker = markersRef.current[pickupDepartmentId]
            if (marker) {
                setTimeout(() => {
                    marker.showCallout()
                }, 300)
                //setNeedCalloutShow(undefined)
            }
        }
    }

    const onSelect = (
        id: number,
        scrollTo: boolean = false,
        showCallout: boolean = false,
    ) => {
        const prevId = pickupDepartmentId
        vorder.pickupDepartmentChange(id)
        if (scrollTo) {
            refs.sheet.current?.scrollToView(refs.options.current[id])
        }
        if (showCallout) {
            const marker = markersRef.current[id]
            if (marker) {
                marker.showCallout()
            }
        }
    }

    const options = company.officesPickup.map(item => {

        const res: UiListItemProps = {
            label: item.NAME,
            value: item.ID,
            data: item,
            content: item.propValue.WORKTIME,
            contentTextPreset: ['grey30'],
            showMore: false,
            itemsRefId: item.ID
        }

        if (vorder.attrValue['PICKUP_DEPARTMENT'] === item.ID) {
            res.sideSlot = <UiBtn
                icon={icons.nav}
                iconSize={24}
                link={true}
                color={COLORS.primary}
                onPress={() => setMode('map')}
            />
        }

        return res
    })

    const onShow = () => {
        initialPickupDepartmentRef.current = vorder.attrValue['PICKUP_DEPARTMENT']
        if (vorder.dialogs.pickup.props.viewmode === 'map') {
            setMode('map')
        }
    }

    const onFindNearest = async (fromMap = false) => {
        setNearestLoading(true)
        const coords = await geo.getLocationCoords()
        if (coords) {
            const offices = await company.queryOfficeList({
                filter: {
                    ROLES_XMLID: {eq: "pickup"}
                },
                position: {
                    lat: coords.lat,
                    lon: coords.lon,
                },
                nav: {
                    postLimit: 2
                }
            })

            if (offices && offices.length) {
                onSelect(offices[0].ID, true, true)
            }
        }
        setNearestLoading(false)
    }

    const actions = useMemo(() => {
        const res: UiBtnProps[] = []
        res.push({
            outline: true,
            color: COLORS.primary,
            loading: nearestLoading,
            children: <View gap-2 centerH>
                {icons.nav({size: 15, color: COLORS.primary})}
                <Text text-xs-m-lh0>Ближайшее</Text>
            </View>,
            avoidMinWidth: true,
            buttonStyle: {
                paddingHorizontal: 8,
                paddingTop: 3,
                alignSelf: 'stretch',
                flexGrow: 1,
                backgroundColor: '#FFFFFF'
            },
            containerStyle: {},
            onPress: onFindNearest,
        })
        res.push({
            label: 'Готово',
            disabled: !vorder.attrValue['PICKUP_DEPARTMENT'],
            onPress: () => refs.sheet?.current.closeModal(),
            containerStyle: {
                flexGrow: 1,
                alignItems: 'stretch',
            }
        })
        return res
    }, [vorder.attrValue['PICKUP_DEPARTMENT'], nearestLoading])

    const [] = useState(0)

    const [defaultCenter] = useState(() => sale.getDeliveryZonesCenter())

    const initialRegion = useMemo(() => ({
        ...defaultCenter.getGoogleData(),
        latitudeDelta: 0.20,
        longitudeDelta: 0.20,
    }), [])

    const onMapOfficeSelect = useCallback((view: TOfficeView) => {
        onSelect(view.entity.ID, true, false)
    }, [])

    const onClose = useCallback<TBottomSheetOnClose>((fromDismiss) => {
        vorder.vorderDialogClose('pickup')
        if (fromDismiss) {
            if (initialPickupDepartmentRef.current !== vorder.attrValue['PICKUP_DEPARTMENT']) {
                vorder.deliveryRequestReserveDebouncedFast()
            }
        }
    }, [])

    return (
        <UiBottomSheet
            ref={refs.sheet}
            enableContentPanningGesture={mode === 'list'}
            enableFooterMarginAdjustment={mode === 'list'}
            onShow={onShow}
            id={'pickup'}
            isVisible={vorder.dialogs.pickup.visible}
            title="Самовывоз"
            onClose={onClose}
            preset={'default'}
            targetModifiers={{
                'scroll': [],
                'header': []
            }}
            autoHeight={false}
            snapPoints={['100%']}
            footerActions={actions}
            stackBehavior={'push'}
            //onBeforeClose={onBeforeClose}
            //bodyScrollable={mode === 'list'}
            footerActionsContainerStyle={{
                flexDirection: 'row',
                gap: 10,
                alignContent: 'stretch'
            }}
            scrollProps={mode === 'list' ? {
                stickyHeaderIndices: [0]
            } : undefined}
            topInsetAdd={20}
        >

            <View
                style={[
                    mode === 'map' ? {
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        width: '100%',
                        zIndex: 10000
                    } : {
                        backgroundColor: '#FFFFFF'
                    }
                ]}
            >
                <View paddingH-modalH paddingV-modalV gap-10>
                    <UiSegments
                        value={mode}
                        segments={modeOptions}
                        onChangeValue={setMode}
                        activeColor={COLORS.primary}
                        containerStyle={THEME_STYLE.shadow2}
                        key={mode}
                    />
                    {
                        vorder.validateResult.pickup && vorder.validateResult.pickup !== true && <UiMessages
                            items={vorder.validateResult.pickup}
                            preset={['flat', 'dense']}
                        />
                    }
                </View>
            </View>


            {mode === 'list' ?
                <UiOptions
                    itemsRef={refs.options}
                    items={options}
                    value={vorder.attrValue['PICKUP_DEPARTMENT']}
                    onChange={(option) => onSelect(option.data.ID, false, true)}
                    itemPreset={['formOptions']}
                    preset={['formOptions']}
                    marginH-modalH
                    marginB-modalV
                />
                :
                <MapDelivery
                    initialRegion={initialRegion}
                    layoutHeight={wHeight - 100}
                    offices={officesViews}
                    selectedOffice={selectedOfficeView}
                    onOfficeSelect={onMapOfficeSelect}
                    markersRef={markersRef}
                    controlsOffsetTop={100}
                    controlsOffsetBottom={100}
                    onMapReady={onMapReady}
                    ref={refs.map}
                />
            }

        </UiBottomSheet>
    )
})

export default VorderPickupDialog

const styles = StyleSheet.create({

    departmentItem: {
        paddingVertical: 14,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#666666'
    },
    departmentItemSelected: {
        borderColor: COLORS.primary,
        borderWidth: 2,
    },
    mapContainer: {
        //zIndex: 1000,
        height: wHeight - 100,
        //marginVertical: -140,
        //position: 'absolute',
        //left: 0,
        //top: 0,
        width: '100%'
    },
})

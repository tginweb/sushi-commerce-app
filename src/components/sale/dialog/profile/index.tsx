import React, {useCallback, useMemo, useRef, useState} from "react"
import {Alert, ScrollView, StyleSheet, View as NativeView} from "react-native"
import {observer} from "mobx-react"
import {useStores} from "~stores"
import {TBottomSheetOnClose, UiBottomSheet, UiBottomSheetProps} from "~com/ui/bottom-sheet";

import {UiBtnProps} from "~ui/btn";
import {OrderProfileModel} from "@core/sale/model/OrderProfile";
import icons from "~assets/icons-map";
import {COLORS, SPACE, TYPOGRAPHY, wHeight, wWidth} from "~assets/design";
import {Text, View} from "react-native-ui-lib";
import {MapYandex, MapYandexApi} from "~com/geo/map-yandex";
import {TGeoCoords} from "@core/geo/types";
import {GeoMarkerHome} from "@core/geo/class/GeoMarkerHome";
import {useScrollView} from "@core/main/lib/hooks/useScrollView";
import {OrderProfile} from "~gql/api";
import {TMaybe} from "@core/main/types";
import {GeoCoordinates} from "@core/geo/class/GeoCoordinates";
import {UiListItemProps} from "~ui/list-item";
import {useServices} from "~services";
import {useStateRef} from "@core/main/lib/hooks/useStateRef";
import {UiLoading} from "~ui/loading";
import {UiOptions} from "~ui/options";
import {UiTabBar, UiTabController, useTabs} from "~ui/tabs";
import {useWatch} from "@core/main/lib/hooks/useWatch";
import {moderateScale} from "@core/main/lib/scale";

export const ProfileModal: React.FC = observer(({}) => {

    const refs = {
        layout: useRef<NativeView>(null as any),
        editor: useRef<any>(null),
        list: useRef<any>(null),
        map: useRef<MapYandexApi | undefined>(null as any),
        scroll: useRef<ScrollView>(null as any),
        options: useRef<any>({}),
    }

    const {vorder, sale, profileDialog, profileEditDialog} = useStores()
    const {catalogUtil} = useServices()

    const isContextVorder = profileDialog.props.context === 'vorder'


    const scrollView = useScrollView(refs.scroll)


    const [loading, setLoading] = useState<boolean>(false)
    const [changedProfileIds, , changedProfileIdsRef, updateChangedProfileIds] = useStateRef<number[]>([])
    const [coordinates, setCoordinates] = useState<TGeoCoords>([104.282275, 52.288165])

    const [selectedProfileId, , selectedProfileIdRef, updateSelectedProfileId] = useStateRef<number | null | undefined>(0)

    const selectedProfile = selectedProfileId ? sale.getProfileById(selectedProfileId) : null

    const [mapVisible, setMapVisible] = useState<boolean>(true)

    const [version, setVersion] = useState<number>(0)


    // METHODS

    const onSaved = async (profile: OrderProfileModel, action: 'create' | 'save') => {

        updateChangedProfileIds([...changedProfileIds, profile.ID])

        requestAnimationFrame(() => {
            sale.mergeProfile(profile)
            setVersion(version + 1)
            updateSelectedProfileId(profile.ID)
            setTimeout(() => {
                refs.map.current?.command({
                    name: 'updateMarkers',
                    markersObjects: getMarkers()
                })
                setTimeout(() => {
                    mapNavProfile(profile)
                    if (action === 'create') {
                        //setTimeout(() => onClose(), 300)
                    }
                }, 500)
            }, 100)
        })
    }

    const onDeleted = async (deletedProfile: OrderProfileModel) => {
        requestAnimationFrame(() => {
            sale.deleteProfile(deletedProfile)
            refs.map.current?.command({
                name: 'updateMarkers',
                markersObjects: getMarkers()
            })
            const profile = sale.getUserDefaultProfile()
            if (profile) {
                updateSelectedProfileId(profile.ID)
                setTimeout(() => {
                    mapNavProfile(profile)
                }, 500)
            }
        })
    }

    const options = useMemo<UiListItemProps[]>(() => {
        return sale.userOrderProfiles.map(profile => {
            const buttons: UiBtnProps[] = []
            if (selectedProfileId === profile.ID)
                buttons.push({
                    icon: icons.edit,
                    iconSize: moderateScale(21, 1.9),
                    borderRadius: 0,
                    link: true,
                    'paddingL-10': true,
                    onPress: () => onEditProfile(profile)
                })
            return {
                label: () => {
                    const duration = vorder.deliveryDurationByProfileActual[profile.ID]
                    return <View gap-2>

                        <Text>{profile.getAddressForView()}</Text>

                        {(!!duration || !!profile.deliveryFreeFromPrice) && <Text grey40 text-xs-r>
                            Доставка
                            {
                                !!duration && <Text primaryLighter text-xs-m>
                                    {SPACE}от {duration.minutes} мин
                                </Text>
                            }
                            {SPACE}
                            {
                                !!profile.deliveryFreeFromPrice && <>
                                    бесплатно от
                                    <Text text-xs-r grey30>
                                        {SPACE}{catalogUtil.price(profile.deliveryFreeFromPrice)}
                                    </Text>
                                </>
                            }
                        </Text>}

                    </View>
                },
                value: profile.ID,
                data: profile,
                radio: true,
                selected: selectedProfileId === profile.ID,
                rightButtons: buttons,
                //caption: profile.deliveryFreeFromPrice ? 'Доставка бесплатно от ' + catalogUtil.price(profile.deliveryFreeFromPrice) : '',
                elementsStyle: {
                    caption: {
                        ...TYPOGRAPHY['text-3xs-lh0'],
                    }
                }
            }
        })
    }, [
        sale.userOrderProfiles,
        selectedProfileId,
        vorder.deliveryDurationByProfileActual
    ])

    const showDefaultInformer = !isContextVorder && options.length

    const getMarkers = useCallback(() => {
        return sale.userOrderProfiles
            .filter(profile => !!profile.mapCoords)
            .map(profile => {

                return new GeoMarkerHome(
                    profile.ID.toString(),
                    profile.mapCoords as GeoCoordinates,
                    {},
                    {},
                    {
                        iconContent: profile.getAddressForView('city', false)
                    },
                )
            })
    }, [])

    const markers = useMemo(getMarkers, [sale.userOrderProfiles])

    const setProfileState = (profile: OrderProfileModel) => {
        updateSelectedProfileId(profile.ID)
        //if (profile.mapCoords) setCoordinates(profile.mapCoords.getArray())
    }

    const onProfileSelect = async (profile?: OrderProfileModel) => {
        if (profile) {
            setProfileState(profile)
            if (!isContextVorder) {
                if (selectedProfileIdRef.current !== profile.ID) {
                    setLoading(true)
                    await profile.setDefault()
                    setLoading(false)
                }
            }
        }
    }

    const onEditProfile = useCallback((profile: OrderProfileModel) => {
        profileEditDialog.showProfile(profile, {
            onSaved,
            onDeleted
        })
    }, [onSaved, onDeleted])

    const onCreateProfile = useCallback(() => {
        tabs.changeTabWithState('list')
        profileEditDialog.showProfile(new OrderProfileModel({} as OrderProfile), {
            onSaved,
            onDeleted
        })
    }, [onSaved, onDeleted])

    const mapNavProfile = (p: OrderProfileModel) => {
        refs.map.current?.command({
            name: 'moveToMarkerId',
            id: p.ID.toString(),
            select: true
        })
    }

    const onMapProfileSelect = (markerId: string) => {
        const profile = sale.getProfileById(parseInt(markerId))
        onProfileSelect(profile)
        scrollView.scrollToView(refs.options?.current[markerId])
    }

    const onListProfileSelect = (profileId: number, profile: OrderProfileModel) => {
        onProfileSelect(profile)
        mapNavProfile(profile)
    }

    const onShow = () => {

        updateChangedProfileIds([])
        let profile: TMaybe<OrderProfileModel>
        if (profileDialog.props.profileId) {
            profile = sale.getProfileById(profileDialog.props.profileId)
        } else if (profileDialog.props.profile) {
            profile = profileDialog.props.profile
        }
        if (!profile) {
            profile = sale.getUserDefaultProfile()
        }
        if (profile) {
            updateSelectedProfileId(profile.ID)
            if (profile.mapCoords)
                setCoordinates(profile.mapCoords.getArray())
        }
    }

    const updateVorderProfile = useCallback(() => {
        if (
            selectedProfile && (
                vorder.profileId !== selectedProfile.ID ||
                changedProfileIdsRef.current.indexOf(selectedProfile.ID) > -1
            )
        ) {
            vorder.setProfile(selectedProfile)
            vorder.deliveryRecalculateAfterProfileUpdate()
            setTimeout(() => {
                vorder.vorderValidate('delivery')
            }, 200)
        }
    }, [selectedProfileId, selectedProfile])

    const onClose = useCallback<TBottomSheetOnClose>((fromDismiss) => {
        console.log('ON CLOSE', {
            'selectedProfile.ID': selectedProfile?.ID,
            'selectedProfile.DATA': selectedProfile?.getAddressForInput(),
            'changedProfileIdsRef.current': changedProfileIdsRef.current
        })
        if (selectedProfile) {
            if (isContextVorder) {
                updateVorderProfile()
            } else {
                sale.setUserDefaultProfile(selectedProfile.ID)
                if (vorder.profileId === selectedProfile.ID) {
                    updateVorderProfile()
                } else {
                    Alert.alert(
                        'Сменить адрес оформляего заказа?',
                        'На адрес ' + selectedProfile.getAddressForView('city', false),
                        [
                            {
                                text: "Сменить адрес заказа",
                                onPress: () => {
                                    updateVorderProfile()
                                },
                                style: 'default'
                            },
                            {text: "Отмена", style: 'cancel'},
                        ])
                }
            }
        }
        profileDialog.hide()
    }, [selectedProfileId, selectedProfile])

    const actions = useMemo<UiBtnProps[]>(() => {

        const res: UiBtnProps[] = []


        if (options.length) {
            res.push({
                label: 'Новый',
                onPress: onCreateProfile,
                icon: icons.plus,
                outline: true,
                color: COLORS.primary,
                containerStyle: {}
            })
            res.push({
                label: 'Готово',
                onPress: () => profileDialog.hide(),
                containerStyle: {
                    flexGrow: 1
                }
            })
        } else {
            res.push({
                label: 'Добавить адрес',
                onPress: onCreateProfile,
                icon: icons.plus,
                containerStyle: {
                    flexGrow: 1
                }
            })
        }
        return res
    }, [
        onCreateProfile,
        selectedProfileId,
        options.length
    ])

    const [contentHeight, setContentHeight] = useState(0)

    const mapHeight = wHeight - (showDefaultInformer ? 350 : 290)

    const onBodyHeightChange = useCallback((height: number) => {
        setContentHeight(height)
    }, [])

    type TabValueEnum = 'list' | 'map'

    const tabs = useTabs<TabValueEnum>({
        value: 'list',
        items: [
            {label: 'Список', value: 'list'},
            {label: 'На карте', value: 'map'},
        ]
    })


    useWatch(() => {
        if (tabs.activeValue === 'map') {
            setTimeout(() => {
                setMapVisible(true)
            }, 700)
        } else {
            setMapVisible(false)
        }
    }, [tabs.activeValue])

    const sheetProps = useMemo(() => {
        let res: UiBottomSheetProps = {}
        if (tabs.activeValue === 'list') {
            res = {
                ...res,
                autoHeight: true,
                bodyScrollable: true,
                enableContentPanningGesture: true,
                footerIsFixed: true,
                footerActionsContainerStyle: {
                    flexDirection: 'row',
                    gap: 12
                }
            }
        } else {
            res = {
                ...res,
                autoHeight: false,
                snapPoints: ['100%'],
                bodyScrollable: false,
                enableContentPanningGesture: false,
                useAnomalyInsets: true,
                footerIsFixed: false,
                footerActionsContainerStyle: {
                    paddingHorizontal: 16,
                    paddingTop: 16,
                    flexDirection: 'row',
                    gap: 12
                }
            }
        }
        return res
    }, [tabs.activeValue])


    return <UiBottomSheet
        topInsetAdd={15}
        id={'profiles'}
        isVisible={profileDialog.visible}
        onShow={onShow}
        onClose={onClose}
        preset={'default'}
        targetModifiers={{
            scroll: []
        }}
        stackBehavior={'push'}
        keyboardFooterBehavior={'visible'}
        keyboardExtraSpace={false}
        title={"Ваши адреса"}
        footerActions={actions}
        onBodyHeightChange={onBodyHeightChange}
        {...sheetProps}
    >

        <UiTabController
            ref={tabs.ref as any}
            items={tabs.items}
            onChangeValue={tabs.onChangeValue}
            initialValue={tabs.activeValue}
        >
            {!!options.length ?
                <>

                    <View marginV-10 marginH-modalH>
                        <UiTabBar
                            preset={'normal'}
                            height={35}
                            spreadItems={true}
                            indicatorInsets={10}
                            indicatorStyle={{
                                display: 'none'
                            }}
                            containerWidth={wWidth - 24}
                        />
                    </View>


                    {
                        tabs.activeValue === 'list' ?
                            <View flex marginB-14 marginH-modalH>

                                {loading && <UiLoading
                                    preset={'light'}
                                    overlay={true}
                                />}

                                <UiOptions
                                    itemsRef={refs.options}
                                    value={selectedProfileId}
                                    preset={['formOptions']}
                                    itemPreset={['formOptions']}
                                    onChangeValue={onListProfileSelect}
                                    itemProps={{showMore: false}}
                                    items={options}
                                />

                            </View>
                            :
                            <View marginB-14>
                                {!!options.length && profileDialog.visible && tabs.activeValue === 'map' &&
                                    <View style={{height: mapHeight}}>
                                        {mapVisible && <MapYandex
                                            ref={refs.map}
                                            coords={coordinates}
                                            markers={markers}
                                            markersSelectable={true}
                                            selectedMarkerId={selectedProfileId ? selectedProfileId.toString() : undefined}
                                            height={mapHeight}
                                            zoom={17}
                                            actionNavigatorEnable={false}
                                            onMarkerClick={onMapProfileSelect}
                                            //positionLoading={methods.findAddress.pending}
                                            //onPositionChange={methods.onMapPositionChange}
                                            //onClose={() => onClose && onClose()}
                                        />}
                                    </View>
                                }
                            </View>
                    }

                    {!isContextVorder && options.length > 1 && <View marginH-modalH marginB-10>
                        <Text text-xs-m primary center>Выбранный адрес будет ипользован по умолчанию</Text>
                    </View>}
                </>
                :
                <View marginV-30>
                    <Text center>у вас нет сохраненных адресов</Text>
                </View>
            }

        </UiTabController>
    </UiBottomSheet>
})

export default ProfileModal

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    mapView: {
        borderBottomWidth: 1,
        borderColor: COLORS.grey30
    },
    scrollView: {
        flex: 1,
    },
    scrollViewContentContainer: {
        paddingHorizontal: 16,
        paddingTop: 16
    },
})

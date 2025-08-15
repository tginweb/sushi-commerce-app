import React, {useCallback, useEffect, useMemo, useRef, useState} from "react"
import {Keyboard, StyleSheet, View as NativeView} from "react-native"
import {observer, useLocalObservable} from "mobx-react"
import {useStores} from "~stores"
import {TGeoCoordsData} from "@core/geo/types";
import {GeoObject} from "~gql/api";
import {MapYandexApi} from "~com/geo/map-yandex";
import {useWatch} from "@core/main/lib/hooks/useWatch";
import {Text, View} from "react-native-ui-lib";
import {UiAddressInput, UiAddressInputOption} from "~ui/address-input";
import {COLORS, THEME_STYLE, wHeight, wWidth} from "~assets/design";
import {UiBtnProps} from "~ui/btn";
import useKeyboard from "@core/main/lib/hooks/useKeyboard";
import {UiTextField, UiTextFieldApi} from "~ui/text-field";
import {RequestsModel} from "@core/main/model/Requests";
import {RequestModel} from "@core/main/model/Request";
import haveErrors from "@core/main/util/validate/haveErrors";
import {UiActions} from "~ui/actions";
import UiDialog from "~ui/dialog";
import {interpolate, useAnimatedKeyboard, useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import {validateRefs} from "@core/main/util/validate";
import {useLayout} from "@core/main/lib/hooks/useLayout";
import {MapAddressSelect} from "~com/geo/map-address-select";
import {useScreenSize} from "@core/main/lib/hooks/useScreenSize";
import {useAnimationOpacity} from "@core/main/lib/hooks/useAnimationOpacity";
import {UiSegments} from "~ui/segments";
import {UiSwitch} from "~ui/switch";
import {UiSelect} from "~ui/select";
import {MapDelivery} from "~com/geo/map-delivery";
import {TOfficeView} from "@core/company/types";
import MapView from "react-native-maps";
import sleep from "@core/main/util/base/sleep";
import {LatLng} from "react-native-maps/lib/sharedTypes";
import {UiListItemProps} from "~ui/list-item";
import {CompanyOfficeModel} from "@core/company/model/CompanyOffice";
import {TValidateErrors} from "@core/main/types";

type TOfficeArg = TOfficeView | number

export const DeliveryEditModal: React.FC = observer(({}) => {

    const {deliveryEditDialog, company, sale, user, vorder} = useStores()

    const isStartup = deliveryEditDialog.props.isStartup
    const keyboard = useKeyboard()
    const keyboardAnimated = useAnimatedKeyboard()

    const keyboardShowAnim = useSharedValue(0)

    const {insets, anomalyBottomInset} = useScreenSize({
        outOfPage: true,
        useAnomalyInsets: true
    })

    const profile = deliveryEditDialog.props.profile

    if (!profile)
        return <></>

    const mapDraggingShared = useSharedValue(0)

    const [mapVisible, setMapVisible] = useState<boolean>(false)

    const [coordinates, setCoordinates] = useState<TGeoCoordsData>(() => {
        const _coords = profile.mapCoords
        return _coords ? _coords.getArray() : [104.282275, 52.288165]
    })

    const [addressText, setAddressText] = useState<string>(profile.getAddressForInput())
    const [addressInputOptionsOpened, setAddressInputOptionsOpened] = useState<boolean>(false)

    const [focus, setFocus] = useState<'map' | 'input'>('map')
    const [mapDragging, setMapDragging] = useState<boolean>(false)

    const [mapMarginTop, setMapMarginTop] = useState<number>(0)
    const [findAddressProcess, setFindAddressProcess] = useState<boolean>(false)

    const controlsVisible = useAnimationOpacity()

    const [errorMessages, setErrorMessages] = useState<TValidateErrors>([])

    const [deliveryId, setDeliveryId] = useState<number>(vorder.attrValue['DELIVERY_ID'] || 1)
    const [pickupDepartmentId, setPickupDepartmentId] = useState<number>(vorder.attrValue['PICKUP_DEPARTMENT'])

    const [mapLocked, setMapLocked] = useState<boolean>(false)


    useWatch(() => {
        setPickupDepartmentId(vorder.attrValue['PICKUP_DEPARTMENT'])
    }, [vorder.attrValue['PICKUP_DEPARTMENT']])

    useWatch(() => {
        setDeliveryId(vorder.attrValue['DELIVERY_ID'])
    }, [vorder.attrValue['DELIVERY_ID']])

    const refs = {
        layout: useRef<NativeView>(null as any),
        mapCourier: useRef<MapYandexApi | undefined>(undefined),
        mapPickup: useRef<MapView | undefined>(undefined),
        address: useRef<UiTextFieldApi>(null as any),
        flat: useRef<UiTextFieldApi>(null as any),
        floor: useRef<UiTextFieldApi>(null as any),
        department: useRef<UiTextFieldApi>(null as any),
    }

    const layout = useLayout(refs.layout, {testId: 'yandex-map-layout'})
    const [layoutHeight, setLayoutHeight] = useState(0)

    const requests: RequestsModel<{
        save: RequestModel,
    }> = useLocalObservable(() => new RequestsModel())

    const onFindAddressStart = useCallback(() => {
        setFindAddressProcess(true)
    }, [])

    const onFindAddressEnd = useCallback(() => {
        setFindAddressProcess(false)
    }, [])


    const _setFocus = (type: 'map' | 'input') => {
        //console.log('_setFocus', type)
        setFocus(type)
        if (type === 'map') {
            Keyboard.dismiss()
            setMapMarginTop(0)
            setTimeout(() => {
                setMapLocked(false)
            }, 500)
        } else {
            setMapLocked(true)
        }
    }

    useEffect(useCallback(() => {
        setTimeout(() => {
            setMapVisible(true)
        }, 500)
    }, []))

    useWatch(() => {
        if (keyboard.show) {
            _setFocus('input')
            setMapMarginTop(-wHeight / 7)
        } else {
            setMapMarginTop(0)
        }
    }, [keyboard.show])

    useWatch(() => {
        _setFocus('map')
    }, [deliveryId])

    useWatch(() => {
        setCoordinates(profile.mapCoords ? profile.mapCoords.getArray() : [104.282275, 52.288165])
        setAddressText(profile.getAddressForInput())
    }, [profile.ID])

    const onMapPressOut = useCallback(() => {
        //console.log('onMapPressOut')
        _setFocus('map')
        setMapDragging(false)
        mapDraggingShared.value = withTiming(0, {duration: 300})
        controlsVisible.show()
        refs.address.current?.optionsClose()
    }, [])

    const onMapPressIn = useCallback(() => {
        //console.log('onMapPressIn')
        _setFocus('map')
        setMapDragging(true)
        mapDraggingShared.value = withTiming(1, {duration: 300})
        controlsVisible.hide()
        refs.address.current?.optionsClose()
    }, [])

    const onMapLockedPress = useCallback(() => {
        //console.log('onMapLockedPress')
        _setFocus('map')
    }, [])

    const onFindAddress = useCallback(async (geoObject: GeoObject | null) => {

        if (geoObject) {

            profile.onChangeAddressMap(geoObject)

            setAddressText(profile.getAddressForInput())

            console.log("FOUND ADDRESS", {
                address_short: geoObject.address_short,
                profileGetAddressForInput: profile.getAddressForInput(),
                profileHous: profile.attrValue['HOUSE']
            })

            requestAnimationFrame(() => {
                validateReset()
                setTimeout(() => {
                    refs.address.current?.validate()
                }, 50)
            })

        } else {
            setErrorMessages([{
                message: 'На карте не выбран дом'
            }])
        }
    }, [profile])


    const onChangeAddressFromInput = useCallback((v: UiAddressInputOption) => {
        validateReset()
        profile.onChangeAddressValue(v)
        if (profile.mapCoords) {
            setCoordinates(profile.mapCoords.getArray())
        }
    }, [profile.ID])

    const onDoneFinal = useCallback(async () => {
        setMapVisible(false)
        setTimeout(() => {
            deliveryEditDialog.hide()
        }, 300)
    }, [])

    const onDoneCommitStartup = useCallback(async () => {

        vorder.setFieldValue('DELIVERY_ID', deliveryId)

        if (deliveryId === 1) {
            if (profile.getIsFilled(false)) {
                const request = requests.get('save')
                request.run()
                await profile.save()
                request.resolve()
                sale.mergeProfile(profile)
                vorder.setProfile(profile)
            } else {
                vorder.ensureProfile()
            }
        } else {
            console.log('PICKUP', pickupDepartmentId)
            if (pickupDepartmentId) {
                vorder.pickupDepartmentChange(pickupDepartmentId, false)
            }
        }

        setTimeout(() => {
            onDoneFinal()
            user.onLoginRedirect()
        }, 300)

    }, [deliveryId, profile, pickupDepartmentId, onDoneFinal])

    const onDoneCommitNormal = useCallback(async () => {

        vorder.setFieldValue('DELIVERY_ID', deliveryId)

        if (deliveryId === 1) {
            if (profile.getIsFilled(false)) {
                const request = requests.get('save')
                request.run()
                await profile.save()
                request.resolve()
                sale.mergeProfile(profile)
                vorder.setProfile(profile)
                vorder.deliveryRecalculateAfterProfileUpdate()
            }
        } else {
            if (pickupDepartmentId) {
                vorder.pickupDepartmentChange(pickupDepartmentId, false)
                vorder.deliveryRecalculateAfterDepartmentUpdate()
            }
        }

        setTimeout(() => {
            onDoneFinal()
        }, 300)

    }, [deliveryId, profile, pickupDepartmentId, onDoneFinal])

    const onDone = useCallback(async () => {
        const validateResult = validateRefs(refs, 'all', 'first')
        if (!haveErrors(validateResult)) {
            setErrorMessages([])
            if (isStartup) {
                onDoneCommitStartup()
            } else {
                onDoneCommitNormal()
            }
        } else {
            setErrorMessages(validateResult as TValidateErrors)
        }
    }, [
        deliveryId,
        isStartup,
        onDoneCommitStartup,
        onDoneCommitNormal
    ])

    const onSkip = useCallback(() => {
        if (isStartup) {
            onDoneCommitStartup()
        } else {
            onDoneFinal()
        }
    }, [isStartup, onDoneFinal])


    const isFilled = deliveryId === 1 ? profile.getIsFilled(true) : pickupDepartmentId

    const actions = useMemo<UiBtnProps[]>(() => {
        let res: UiBtnProps[] = []

        if (!isFilled || !isStartup) {
            res.push({
                label: isStartup ? 'Пропустить' : 'Назад',
                onPress: onSkip,
                disabled: requests.isResolvingAny,
                backgroundColor: COLORS.white,
                color: COLORS.grey20,
                labelStyle: {
                    fontSize: 13
                },
                containerStyle: {
                    flex: 5,
                },
                buttonStyle: {
                    paddingHorizontal: 3
                }
            })
        }

        res.push({
            label: 'Готово',
            onPress: onDone,
            loading: requests.isResolving('save') || findAddressProcess,
            disabled: requests.isResolvingAny || findAddressProcess,
            containerStyle: {
                flex: 12
            }
        })

        return res
    }, [
        profile.ID,
        onDone,
        onSkip,
        requests.isResolvingAny,
        isFilled,
        findAddressProcess,
        isStartup
    ])

    useEffect(() => {
        if (layout.measure.height && !layoutHeight) {
            setLayoutHeight(layout.measure.height)
        }
    }, [layout.measure.height])

    useEffect(() => {
        keyboardShowAnim.value = withTiming(keyboard.willShow ? 1 : 0, {duration: 300})
    }, [keyboard.willShow])

    const mapHeight = layoutHeight

    /*
    const footerStyle = useAnimatedStyle(() => {
        return {
            bottom: insets.bottom + keyboardAnimated.height.value
        }
    }, [insets.bottom, anomalyBottomInset])

     */


    const footerStyle = useAnimatedStyle(() => {
        return {
            bottom: keyboardAnimated.height.value + interpolate(
                keyboardAnimated.height.value,
                [0, 300],
                [insets.bottom || 25, 0],
            )
        }
    }, [insets.bottom, anomalyBottomInset])

    const [defaultCenter] = useState(() => sale.getDeliveryZonesCenter())

    const initialRegion = useMemo(() => ({
        ...defaultCenter.getGoogleData(),
        latitudeDelta: 0.20,
        longitudeDelta: 0.20,
    }), [])

    const getOfficeView = (office: TOfficeArg) => {
        let officeView: TOfficeView | undefined
        if (!office)
            return;
        if (typeof office === 'number') {
            officeView = officeViews.find(item => item.entityId === office)
        } else {
            officeView = office
        }
        return officeView
    }

    const officeSelectFromMap = (office: TOfficeArg) => {
        const view = getOfficeView(office)
        if (!view)
            return;
        setPickupDepartmentId(view.entityId)
        setTimeout(() => {
            officeShowCallout(view)
        }, 100)
    }

    const officeSelectFromPicker = async (office: TOfficeArg) => {
        validateReset()
        const view = getOfficeView(office)
        if (!view)
            return;
        setPickupDepartmentId(view.entityId)
        await mapNav(view.marker?.coordinate)
        officeShowCallout(view)
    }

    const officeShowCallout = (view: TOfficeView) => {
        const marker = officeMarkers.current[view.entityId]
        if (marker) {
            marker.showCallout()
        }
    }

    const offices = useMemo<CompanyOfficeModel[]>(() => {
        return company.offices.filter(office => !!office.propValue.COORDINATES)
    }, [])

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
    }, [offices])

    const selectedOfficeView = officeViews.find(view => view.entityId === pickupDepartmentId)

    const officesOptions = useMemo<UiListItemProps[]>(() => {
        return officeViews.map(view => ({
            label: view.entity.NAME,
            value: view.entity.ID,
            data: view
        }))
    }, [offices])

    const mapNav = async (coords?: LatLng, delta = 0.015) => {
        if (!coords || !refs.mapPickup.current) {
            return
        }
        const camera = await refs.mapPickup.current?.getCamera()
        if (camera) {
            refs.mapPickup.current?.animateToRegion({
                ...coords,
                latitudeDelta: delta,
                longitudeDelta: delta
            }, 1000)
            await sleep(1000)
        }
    }

    const validateReset = useCallback(() => {
        refs.address.current?.validateReset()
        refs.flat.current?.validateReset()
        setErrorMessages([])
    }, [])

    const officeMarkers = useRef<any>({})

    return <UiDialog
        visible={deliveryEditDialog.visible}
        onClose={() => deliveryEditDialog.hide()}
        containerStyle={{
            padding: 0
        }}
        width={wWidth}
        headerHide={true}
        height={'100%'}
        useSafeArea={false}
        modalProps={{
            useKeyboardAvoidingView: false,
            keyboardAvoidingViewProps: {
                //behavior: 'padding'
            }
        }}
    >
        <View
            ref={refs.layout}
            onLayout={layout.onLayout}
            style={{
                flex: 1,
            }}
        >
            <View
                reanimated gap-12
                paddingH-12
                paddingV-15
                marginT-12
                style={[
                    styles.fieldAddress,
                    controlsVisible.style, {
                        top: insets.top
                    }
                ]}
            >
                <UiSegments
                    segments={vorder.deliveryOptions}
                    activeColor={COLORS.primary}
                    value={deliveryId}
                    onChangeValue={(v: any) => {
                        setDeliveryId(v)
                    }}
                    showIcon={false}
                />

                {
                    deliveryId === 1 ?
                        <View gap-10>
                            <UiAddressInput
                                optionsHeight={keyboard.height ? 300 : 400}
                                optionsScroll={true}
                                placeholder={'Введите адрес доставки'}
                                errorHide={true}
                                errorsStyle={styles.fieldErrors}
                                fieldStyle={styles.field}
                                presets={['outline', 'xs']}
                                house={profile.attrValue.HOUSE}
                                value={addressText}
                                ref={refs.address}
                                validateOnBlur={false}
                                validateOnChange={false}
                                validateOnChangeExternal={false}
                                resetErrorsOnChange={true}
                                onChangeValue={onChangeAddressFromInput}
                                bottomSheetHandleScroll={false}
                                onFocus={() => {
                                    _setFocus('input')
                                }}
                                onOptionsOpen={() => {
                                    setAddressInputOptionsOpened(true)
                                }}
                                onOptionsClose={() => {
                                    setAddressInputOptionsOpened(false)
                                }}
                                onChangeText={() => {
                                    validateReset()
                                }}
                                onClear={() => {
                                    profile?.clearAddress()
                                    setAddressText('')
                                    refs.address.current?.clear()
                                    validateReset()
                                }}
                                fromBound={'city'}
                                toBound={'house'}
                                multiline={true}
                                numberOfLines={2}
                                sideSlotsCentered={false}
                                hideLocalOnBlur={true}
                                clearable={true}
                            />
                            {
                                !addressInputOptionsOpened &&
                                profile.attrValue.HOUSE &&
                                <View row gap-10>
                                    {profile.attrValue['PRIVATE_HOUSE'] !== 'Y' && <>
                                        <View flex-10>
                                            <UiTextField
                                                ref={refs.flat}
                                                bottomSheetHandleScroll={false}
                                                placeholder='Квартира'
                                                presets={['outline', 'xs']}
                                                value={profile.attrValue['FLAT']}
                                                onChangeText={(v: any) => {
                                                    if (profile)
                                                        profile.setPropValue('FLAT', v)
                                                    validateReset()
                                                }}
                                                required={'Укажите номер квартиры'}
                                                errorHide={true}
                                                validateOnChange={true}
                                                keyboardType='numeric'
                                            />
                                        </View>
                                        <View flex-7>
                                            <UiTextField
                                                ref={refs.floor}
                                                bottomSheetHandleScroll={false}
                                                placeholder='Этаж'
                                                errorHide={true}
                                                presets={['outline', 'xs']}
                                                value={profile.attrValue['FLOOR']}
                                                onChangeText={(v: any) => {
                                                    profile.setPropValue('FLOOR', v)
                                                    validateReset()
                                                }}
                                                validateOnChange={true}
                                                keyboardType='numeric'
                                            />
                                        </View>
                                    </>}
                                    <View flex-12>
                                        <UiSwitch
                                            value={profile.attrValue['PRIVATE_HOUSE'] === 'Y'}
                                            onValueChange={(v) => {
                                                profile.setPropValue('PRIVATE_HOUSE', v ? 'Y' : 'N')
                                                validateReset()
                                            }}
                                            labelModifiers={{
                                                'text-sm-lh1': true
                                            } as any}
                                            label={'Частный дом'}
                                            style={{
                                                flexWrap: 'wrap',
                                            }}
                                            marginT-8
                                        />
                                    </View>
                                </View>
                            }

                        </View>
                        :
                        <UiSelect
                            ref={refs.department}
                            items={officesOptions}
                            presets={['outline', 'xs']}
                            value={pickupDepartmentId}
                            onSelect={(optionValue, optionData) => officeSelectFromPicker(optionData)}
                            closeOnChange={true}
                            doneShow={true}
                            errorHide={true}
                            doneEnable={'value'}
                            selectView={'dialog'}
                            placeholder={'выберите подразделение'}
                            itemsView={'options'}
                            required={'Укажите подразделение'}
                            dialogProps={{
                                title: 'Выберите подразделение',
                                useSafeArea: true,
                                height: '90%'
                            }}
                        />
                }

                {haveErrors(errorMessages) && (
                    <View style={[styles.fieldErrors]} gap-3>
                        {errorMessages.map((message, index) => (
                            <View key={index}>
                                <Text text-sm-lh1 red20>{message.message}</Text>
                            </View>
                        ))}
                    </View>
                )}

            </View>

            {!!mapHeight && mapVisible && deliveryEditDialog.visible &&
                <View style={{height: mapHeight}}>
                    {
                        deliveryId === 1 ?
                            <MapAddressSelect
                                ref={refs.mapCourier}
                                coords={coordinates}
                                height={mapHeight}
                                width={wWidth}
                                marginTop={mapMarginTop}
                                controlsOffsetTop={240}
                                controlsOffsetBottom={100}
                                onFindAddress={onFindAddress}
                                onFindAddressStart={onFindAddressStart}
                                onFindAddressEnd={onFindAddressEnd}
                                onPressIn={onMapPressIn}
                                onPressOut={onMapPressOut}
                                locked={mapLocked}
                                onLockedPress={onMapLockedPress}
                            />
                            :
                            <MapDelivery
                                initialRegion={initialRegion}
                                layoutHeight={mapHeight}
                                offices={officeViews}
                                selectedOffice={selectedOfficeView}
                                onOfficeSelect={officeSelectFromMap}
                                markersRef={officeMarkers}
                                controlsOffsetTop={240}
                                controlsOffsetBottom={100}
                                ref={refs.mapPickup}
                            />
                    }
                    <UiActions
                        reanimated
                        items={actions}
                        marginH-16
                        marginV-16
                        style={[
                            styles.actions,
                            footerStyle,
                            controlsVisible.style
                        ]}
                    />
                </View>
            }

        </View>

    </UiDialog>

})

export default DeliveryEditModal

const styles = StyleSheet.create({
    fieldAddress: {
        position: 'absolute',
        left: 10,
        right: 10,
        borderRadius: 10,
        zIndex: 10000,
        backgroundColor: COLORS.white,
        ...THEME_STYLE.shadow2
    },
    fieldErrors: {
        backgroundColor: '#FFFFFF',
        padding: 0,
        borderRadius: 12
    },
    field: {
        backgroundColor: '#FFFFFF'
    },
    actions: {
        flexDirection: 'row',
        gap: 8,
        position: 'absolute',
        zIndex: 3000,
        left: 0,
    }
})

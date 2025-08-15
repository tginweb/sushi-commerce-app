import React, {useCallback, useEffect, useMemo, useRef, useState} from "react"
import {Keyboard, StyleSheet, View as NativeView} from "react-native"
import {observer, useLocalObservable} from "mobx-react"
import {useStores} from "~stores"
import {TGeoCoordsData} from "@core/geo/types";
import {GeoObject} from "~gql/api";
import {MapYandexApi} from "~com/geo/map-yandex";
import {useWatch} from "@core/main/lib/hooks/useWatch";
import {View} from "react-native-ui-lib";
import {UiAddressInput, UiAddressInputOption} from "~ui/address-input";
import {COLORS, THEME_STYLE, wHeight, wWidth} from "~assets/design";
import {UiBtnProps} from "~ui/btn";
import useKeyboard from "@core/main/lib/hooks/useKeyboard";
import {UiTextFieldApi} from "~ui/text-field";
import {RequestsModel} from "@core/main/model/Requests";
import {RequestModel} from "@core/main/model/Request";
import haveErrors from "@core/main/util/validate/haveErrors";
import {UiActions} from "~ui/actions";
import UiDialog from "~ui/dialog";
import {interpolate, useAnimatedKeyboard, useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import {validateRefs} from "@core/main/util/validate";
import {CLOSER_BACK} from "~assets/icons-map";
import {useLayout} from "@core/main/lib/hooks/useLayout";
import {MapAddressSelect} from "~com/geo/map-address-select";
import {useScreenSize} from "@core/main/lib/hooks/useScreenSize";
import {useAnimationOpacity} from "@core/main/lib/hooks/useAnimationOpacity";

export const ProfileEditModal: React.FC = observer(({}) => {

    const {profileMapDialog, profileEditDialog} = useStores()

    const keyboard = useKeyboard()
    const keyboardAnimated = useAnimatedKeyboard()

    const keyboardShowAnim = useSharedValue(0)

    const {insets, anomalyBottomInset} = useScreenSize({
        outOfPage: true,
        useAnomalyInsets: true
    })

    const profile = profileMapDialog.props.profile

    if (!profile)
        return <></>

    const [mapVisible, setMapVisible] = useState<boolean>(false)

    const [coordinates, setCoordinates] = useState<TGeoCoordsData>(() => {
        const _coords = profile?.mapCoords
        return _coords ? _coords.getArray() : [104.282275, 52.288165]
    })

    const [addressText, setAddressText] = useState<string>(profile.getAddressForInput())
    const [addressInputOptionsOpened, setAddressInputOptionsOpened] = useState<boolean>(false)

    const [focus, setFocus] = useState<'map' | 'input'>('map')
    const [mapDragging, setMapDragging] = useState<boolean>(false)

    const [mapMarginTop, setMapMarginTop] = useState<number>(0)
    const [findAddressProcess, setFindAddressProcess] = useState<boolean>(false)

    const controlsVisible = useAnimationOpacity()

    const [mapLocked, setMapLocked] = useState<boolean>(false)

    const refs = {
        layout: useRef<NativeView>(null as any),
        map: useRef<MapYandexApi | undefined>(undefined),
        address: useRef<UiTextFieldApi>(null as any),
    }

    const layout = useLayout(refs.layout, {testId: 'yandex-map-layout'})
    const [layoutHeight, setLayoutHeight] = useState(0)

    const requests: RequestsModel<{
        save: RequestModel,
        delete: RequestModel,
    }> = useLocalObservable(() => new RequestsModel())

    const onFindAddressStart = useCallback(() => {
        setFindAddressProcess(true)
    }, [])

    const onFindAddressEnd = useCallback(() => {
        setFindAddressProcess(false)
    }, [])


    const _setFocus = (type: 'map' | 'input') => {
        console.log('_setFocus', type)
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
        setCoordinates(profile.mapCoords ? profile.mapCoords.getArray() : [104.282275, 52.288165])
        setAddressText(profile.getAddressForInput())
    }, [profile.ID])


    const onMapPressOut = useCallback(() => {
        console.log('onMapPressOut')
        _setFocus('map')
        setMapDragging(false)
        mapDraggingShared.value = withTiming(0, {duration: 300})
        controlsVisible.show()
        refs.address.current?.optionsClose()
    }, [])

    const onMapPressIn = useCallback(() => {
        console.log('onMapPressIn')
        _setFocus('map')
        setMapDragging(true)
        mapDraggingShared.value = withTiming(1, {duration: 300})
        controlsVisible.hide()
        refs.address.current?.optionsClose()
    }, [])

    const onMapLockedPress = useCallback(() => {
        console.log('onMapLockedPress')
        _setFocus('map')
    }, [])

    const onFindAddress = useCallback(async (geoObject: GeoObject | null) => {
        refs.address.current?.validateReset()
        if (geoObject) {

            profile.onChangeAddressMap(geoObject)
            setAddressText(profile.getAddressForInput())

            console.log("FOUND ADDRESS", {
                address_short: geoObject.address_short,
                profileGetAddressForInput: profile.getAddressForInput()
            })

            requestAnimationFrame(() => {
                setTimeout(() => {
                    refs.address.current?.validate()
                }, 50)
            })
        } else {
            //setAddressText('')
            //setAddressData(null)
        }
    }, [])

    const onChangeAddressFromInput = useCallback((v: UiAddressInputOption) => {
        refs.address.current?.validateReset()
        profile.onChangeAddressValue(v)
        if (profile.mapCoords) {
            setCoordinates(profile.mapCoords.getArray())
        }
    }, [profile.ID])

    const onDone = useCallback(async () => {
        const validateResult = validateRefs(refs, 'all', 'first')
        if (!haveErrors(validateResult)) {
            profileMapDialog.hide()
        }
    }, [])

    const isFilled = profile.getIsFilled(true)

    const actions = useMemo<UiBtnProps[]>(() => {
        let res: UiBtnProps[] = []
        res.push({
            label: 'Готово',
            onPress: onDone,
            loading: requests.isResolving('save') || findAddressProcess,
            disabled: requests.isResolvingAny || findAddressProcess,
            containerStyle: {
                flex: 2
            }
        })
        return res
    }, [
        profile.ID,
        onDone,
        requests.isResolvingAny,
        isFilled,
        findAddressProcess
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

    const footerStyle = useAnimatedStyle(() => {
        return {
            bottom: keyboardAnimated.height.value + interpolate(
                keyboardAnimated.height.value,
                [0, 300],
                [insets.bottom || 25, 0],
            )
        }
    }, [insets.bottom, anomalyBottomInset])

    const mapDraggingShared = useSharedValue(0)

    return <UiDialog
        visible={profileMapDialog.visible}
        onClose={() => profileMapDialog.hide()}
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
                style={[
                    {
                        position: 'absolute',
                        left: 10,
                        right: 10,
                        top: insets.top,
                        borderRadius: 10,
                        zIndex: 10000,
                        backgroundColor: COLORS.white,
                        ...THEME_STYLE.shadow2
                    },
                ]}
                marginT-12
                paddingH-8
                paddingV-11
                gap-8
            >
                <UiAddressInput
                    hideLocalOnBlur={true}
                    optionsHeight={keyboard.height ? 300 : 400}
                    optionsScroll={true}
                    placeholder={'Введите адрес'}
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
                    fromBound={'city'}
                    toBound={'house'}
                    multiline={true}
                    sideSlotsCentered={true}
                    prependSlot={<View style={{alignSelf: 'flex-start'}}>
                        {CLOSER_BACK({
                            color: '#000000',
                            size: 30,
                            style: {},
                            onPress: () => {
                                profileMapDialog.hide()
                            }
                        })}
                    </View>}
                    readonly={findAddressProcess}
                    clearable={true}
                    onClear={() => {
                        profile?.clearAddress()
                        setAddressText('')
                        refs.address.current?.clear()
                    }}
                    //floatingPlaceholder={true}
                />
            </View>

            {
                !!mapHeight && mapVisible && profileMapDialog.visible &&
                <View style={{height: mapHeight, position: 'relative'}}>
                    <MapAddressSelect
                        ref={refs.map}
                        coords={coordinates}
                        height={mapHeight}
                        marginTop={mapMarginTop}
                        controlsOffsetTop={200}
                        controlsOffsetBottom={100}
                        onFindAddress={onFindAddress}
                        onFindAddressStart={onFindAddressStart}
                        onFindAddressEnd={onFindAddressEnd}
                        onPressIn={onMapPressIn}
                        onPressOut={onMapPressOut}
                        locked={mapLocked}
                        onLockedPress={onMapLockedPress}
                    />
                    <UiActions
                        reanimated
                        items={actions}
                        marginH-16
                        marginV-16
                        style={[
                            {
                                flexDirection: 'row',
                                gap: 8,
                                position: 'absolute',
                                zIndex: 3000,
                                left: 0,
                            },
                            footerStyle
                        ]}
                    />
                </View>
            }
        </View>

    </UiDialog>

})

export default ProfileEditModal

const styles = StyleSheet.create({
    fieldErrors: {
        backgroundColor: '#FFFFFF',
        padding: 10,
        borderRadius: 12
    },
    field: {
        backgroundColor: '#FFFFFF'
    },
})

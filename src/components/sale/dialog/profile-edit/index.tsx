import React, {useCallback, useRef} from "react"
import {StyleSheet} from "react-native"
import {observer, useLocalObservable} from "mobx-react"
import {useStores} from "~stores"
import {View} from "react-native-ui-lib";
import {COLORS} from "~assets/design";
import {UiBtnProps} from "~ui/btn";
import {UiTextField, UiTextFieldApi} from "~ui/text-field";
import {UiSwitch} from "~ui/switch";
import {RequestsModel} from "@core/main/model/Requests";
import {RequestModel} from "@core/main/model/Request";
import haveErrors from "@core/main/util/validate/haveErrors";
import {UiBottomSheet} from "~ui/bottom-sheet";
import {UiTextarea} from "~ui/textarea";
import validateRefs from "@core/main/util/validate/validateRefs";
import icons from "~assets/icons-map";

export const ProfileEditModal: React.FC = observer(({}) => {

    const {profileEditDialog, profileMapDialog} = useStores()

    const profile = profileEditDialog.props.profile

    if (!profile)
        return <></>


    const refs = {
        address: useRef<UiTextFieldApi>(null as any),
        flat: useRef(null),
        floor: useRef(null),
        comment: useRef(null),
        entrance: useRef(null),
        intercom: useRef(null),
    }

    const requests: RequestsModel<{
        save: RequestModel,
        delete: RequestModel,
    }> = useLocalObservable(() => new RequestsModel())

    const onSave = async () => {
        const validateResult = validateRefs(refs, 'all', 'first')
        if (!haveErrors(validateResult)) {
            const action = profile.ID ? 'save' : 'create'
            const request = requests.get('save')
            request.run()
            const savedProfile = await profile.save()
            request.resolve()
            if (savedProfile) {
                profileEditDialog.props.onSaved && profileEditDialog.props.onSaved(savedProfile as any, action)
                profileEditDialog.hide()
            }
        }
    }

    const onDelete = useCallback(async () => {
        const request = requests.get('delete')
        request.run()
        await profile.delete()
        request.resolve()
        profileEditDialog.props.onDeleted && profileEditDialog.props.onDeleted(profile)
        profileEditDialog.hide()
    }, [profile])

    const actions = (() => {
        let res: UiBtnProps[] = []

        res = [
            {
                label: 'Сохранить',
                onPress: () => onSave(),
                loading: requests.isResolving('save'),
                disabled: requests.isResolvingAny,
                containerStyle: {
                    flex: 2
                }
            },
        ]

        if (profile.ID) {
            res.push({
                label: 'Удалить',
                onPress: onDelete,
                loading: requests.isResolving('delete'),
                disabled: requests.isResolvingAny,
                color: COLORS.primary,
                backgroundColor: COLORS.white,
                confirm: {
                    title: 'Удалить профиль адреса?',
                },
                containerStyle: {
                    flex: 1,
                }
            })
        }
        return res
    })()

    const textFieldPreset = ['outline', 'sm']

    return (
        <UiBottomSheet
            id={'profile-edit'}
            isVisible={profileEditDialog.visible}
            onClose={() => profileEditDialog.hide()}
            stackBehavior={'push'}
            title={"Редактировать адрес"}
            autoHeight={true}
            preset={'default'}
            footerActions={actions}
            footerActionsContainerStyle={{
                flexDirection: 'row',
                gap: 11
            }}
            footerIsFixed={true}
            //keyboardExtraSpace={true}
            keyboardBehavior={'interactive'}
            topInsetAdd={40}
        >
            <View marginV-22 gap-22>

                <UiTextField
                    ref={refs.address}
                    floatingPlaceholder={true}
                    placeholder='Улица и дом'
                    presets={textFieldPreset}
                    actions={[
                        {
                            link: true,
                            icon: icons.nav,
                            onPress: () => {
                                profileMapDialog.show({
                                    profile: profile
                                })
                            }
                        }
                    ]}
                    value={profile.getAddress(true, false)}
                    editable={false}
                    multiline={true}
                    onPress={() => {
                        profileMapDialog.show({
                            profile: profile
                        })
                    }}
                    readonlyColorPreserve={true}
                    rules={[
                        v => profile.getIsFilled(false) || 'Укажите адрес до дома'
                    ]}
                />

                {
                    profile.attrValue.HOUSE &&
                    profile.attrValue['PRIVATE_HOUSE'] !== 'Y' &&
                    <>
                        <View row gap-16>
                            <View flex-6>
                                <UiTextField
                                    testID={'flat'}
                                    ref={refs.flat}
                                    floatingPlaceholder={true}
                                    placeholder='Квартира'
                                    presets={textFieldPreset}
                                    value={profile.attrValue['FLAT']}
                                    onChangeText={(v: any) => {
                                        profile && profile.setPropValue('FLAT', v)
                                    }}
                                    required={'Укажите номер квартиры'}
                                    validateOnChange={true}
                                    keyboardType='numeric'
                                />
                            </View>
                            <View flex-6>
                                <UiTextField
                                    testID={'floor'}
                                    ref={refs.floor}
                                    floatingPlaceholder={true}
                                    placeholder='Этаж'
                                    presets={textFieldPreset}
                                    value={profile.attrValue['FLOOR']}
                                    onChangeText={(v: any) => profile && profile.setPropValue('FLOOR', v)}
                                    validateOnChange={true}
                                    keyboardType='numeric'
                                />
                            </View>
                        </View>
                        <View row gap-16>
                            <View flex-6>
                                <UiTextField
                                    testID={'entrance'}
                                    ref={refs.entrance}
                                    floatingPlaceholder={true}
                                    placeholder='Подъезд'
                                    presets={textFieldPreset}
                                    value={profile.attrValue['ENTRANCE']}
                                    onChangeText={(v: any) => {
                                        profile && profile.setPropValue('ENTRANCE', v)
                                    }}
                                    validateOnChange={true}
                                    keyboardType='numeric'
                                />
                            </View>
                            <View flex-6>
                                <UiTextField
                                    testID={'intercom'}
                                    ref={refs.intercom}
                                    floatingPlaceholder={true}
                                    placeholder='Домофон'
                                    presets={textFieldPreset}
                                    value={profile.attrValue['INTERCOM']}
                                    onChangeText={(v: any) => profile && profile.setPropValue('INTERCOM', v)}
                                    validateOnChange={true}
                                    keyboardType='numeric'
                                />
                            </View>
                        </View>
                    </>
                }
                <UiTextarea
                    testID={'comment'}
                    presets={textFieldPreset}
                    floatingPlaceholder={true}
                    placeholder='Комментарий к адресу'
                    fieldStyle={{
                        minHeight: 50
                    }}
                    numberOfLines={4}
                    value={profile.attrValue['PROFILE_COMMENT']}
                    onChangeText={(text) => {
                        profile && profile.setPropValue('PROFILE_COMMENT', text)
                    }}
                />
                <UiSwitch
                    value={profile.attrValue['PRIVATE_HOUSE'] === 'Y'}
                    onValueChange={(v) => {
                        profile && profile.setPropValue('PRIVATE_HOUSE', v ? 'Y' : 'N')
                    }}
                    labelModifiers={{
                        'text-sm-lh1': true
                    } as any}
                    label={'Это частный дом'}
                    style={{
                        flexWrap: 'wrap',
                    }}
                />

            </View>
        </UiBottomSheet>
    )
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

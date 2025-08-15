import React, {useCallback, useMemo, useRef, useState} from 'react'
import {Alert, Keyboard, StyleSheet} from 'react-native'
import {observer} from 'mobx-react'
import {useFocusEffect, useNavigation} from "expo-router"
import {useServices} from '~services'
import {useStores} from '~stores'
import {Text, View} from 'react-native-ui-lib'
import {TScreenProps} from "@core/main/types"
import {UiScreen} from "~ui/screen"
import {UiBtn, UiBtnProps} from "~ui/btn";
import {UiCard} from "~ui/card";
import {UiTextField, UiTextFieldApi} from "~ui/text-field";
import {UiDate, UiDatePublicMethods} from "~ui/date";
import {TBottomSheetScope, UiBottomSheet, useBottomSheetScope} from "~ui/bottom-sheet";
import checkEmail from "@core/main/util/validate/checkEmail";
import {TUserEditableModelFields, UserEditableModel} from "@core/user/model/UserEditable";
import {UiContentPublicMethods} from "~ui/content-builder/BuilderRender";
import {COLORS} from "~assets/design";
import {INPUT_MASK_PHONE} from "~assets/config";
import {useWatch} from "@core/main/lib/hooks/useWatch";
import {User, UserFamilyInput} from "~gql/api";
import {UiContentRender} from "~ui/content-builder/render";
import usePage from "@core/page/hooks/usePage";
import dayjs from "dayjs";
import {UiList} from "~ui/list";
import {CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell} from "react-native-confirmation-code-field";
import validateRefs from "@core/main/util/validate/validateRefs";
import AppConfig from "@core/main/config";

type TEmailStep = 'input' | 'confirm' | 'success' | 'intermediate'

type TProfileStep = {
    name: string //'name' | 'email' | 'birthday',
    filled: boolean
}

const EmailDialog = observer((
    {
        userEditModel,
        dialog,
        onSaved,
    }: {
        userEditModel: UserEditableModel,
        dialog: TBottomSheetScope,
        onSaved: (userData: User) => void
    }
) => {
    const {user} = useStores()

    const [stepState, setStepState] = useState<TEmailStep>('input')
    const [emailState, setEmailState] = useState<string>(userEditModel.EMAIL || '')
    const [codeState, setCodeState] = useState<string>('')

    const emailValid = checkEmail(emailState)

    const [codeFieldProps, getCellOnLayout] = useClearByFocusCell({
        value: codeState,
        setValue: setCodeState,
    });

    const codeRef = useBlurOnFulfill({value: codeState, cellCount: 4});

    const setStep = (newStep: TEmailStep) => {
        setStepState(newStep)
    }

    const codeIsValid = useMemo(() => {
        return codeState.length === 4
    }, [codeState])

    useWatch(() => {
        if (codeIsValid) {
            onConfirm()
        }
    }, [codeIsValid])


    const onRequest = useCallback(async () => {
        if (userEditModel) {
            const res = await userEditModel.saveEmail({
                action: 'request',
                email: emailState,
            })
            if (res.state?.success) {
                Keyboard.dismiss()
                setTimeout(() => {
                    setCodeState('')
                    if (AppConfig.USER_EMAIL_NEED_CONFIRM) {
                        setStep('confirm')
                    } else {
                        userEditModel.setFieldValue('EMAIL', emailState)
                        user.setEmail(emailState)
                        setStep('success')
                    }
                }, 200)
            }
        }
    }, [emailState])

    const onConfirm = useCallback(async () => {
        if (userEditModel) {
            const res = await userEditModel.saveEmail({
                action: 'confirm',
                email: emailState,
                code: codeState
            })
            if (res && res.state?.success) {
                userEditModel.setFieldValue('EMAIL', emailState)
                user.setEmail(emailState)
                setStep('success')
            }
        }
    }, [emailState, codeState])

    const footerActions = useMemo(() => {

        const res: UiBtnProps[] = []

        if (stepState === 'input') {
            res.push({
                label: 'Подтвердить',
                loading: userEditModel.saveEmail.pending,
                disabled: !emailValid,
                onPress: () => onRequest()
            })
        } else if (stepState === 'confirm') {
            res.push({
                label: 'Сохранить',
                loading: userEditModel.saveEmail.pending,
                disabled: !emailValid,
                onPress: () => onConfirm()
            })
            res.push({
                label: 'Изменить e-mail',
                color: COLORS.primary,
                outline: true,
                onPress: () => {
                    setStep('input')
                }
            })
        } else {
            res.push({
                label: 'Готово',
                onPress: () => {
                    dialog.hide()
                }
            })
        }

        return res
    }, [emailValid, onRequest, onConfirm, stepState, userEditModel.saveEmail.state])

    return <UiBottomSheet
        id={'profile-edit'}
        isVisible={dialog.visible}
        autoHeight={true}
        onClose={dialog.hide}
        preset={'default'}
        title={'Изменить E-mail'}
        footerActions={footerActions}
        //footerDynamic={true}
        onShow={() => {
            if (stepState === 'success') {
                setStepState('input')
                setCodeState('')
            }
        }}
    >
        <View marginV-30 gap-16 style={{minHeight: 100}}>
            {
                (() => {
                    switch (stepState) {
                        case 'input':
                            return <UiTextField
                                placeholder={'E-mail'}
                                presets={['outline', 'md']}
                                floatingPlaceholder={true}
                                keyboardType={'email-address'}
                                value={emailState}
                                onChangeText={(text) => {
                                    setEmailState(text)
                                }}
                                rules={[
                                    {type: 'email'}
                                ]}
                            />
                        case 'confirm':
                            return <View gap-16 centerH>
                                <Text>
                                    Сейчас на ваш e-mail придет 4-значный код подтверждения. Введите его в поле
                                    ниже:
                                </Text>

                                <View style={{width: 250}}>
                                    <CodeField
                                        ref={codeRef}
                                        {...codeFieldProps}
                                        rootStyle={styles.codeRoot}
                                        value={codeState}
                                        onChangeText={setCodeState}
                                        cellCount={4}
                                        keyboardType="numeric"
                                        autoComplete="off"
                                        renderCell={({index, symbol, isFocused}) => (
                                            <View flex-1 key={index}>
                                                <Text
                                                    key={index}
                                                    autoCorrect={false}
                                                    spellCheck={false}
                                                    style={[styles.codeCell, isFocused && styles.focusCell]}
                                                    onLayout={getCellOnLayout(index)}>
                                                    {symbol || (isFocused ? <Cursor/> : null)}
                                                </Text>
                                            </View>
                                        )}
                                    />
                                </View>

                            </View>
                        case 'success':
                            return <View gap-16>
                                <Text center primary>
                                    E-mail успешно изменен
                                </Text>
                            </View>
                    }
                })()
            }
        </View>
    </UiBottomSheet>
})

const NameDialog = observer((
    {
        userEditModel,
        dialog,
        onSaved
    }: {
        userEditModel: UserEditableModel,
        dialog: TBottomSheetScope,
        onSaved: (userData: User) => void
    }
) => {
    const {user} = useStores()

    const [nameState, setNameState] = useState<string>(userEditModel.NAME || '')

    const nameValid = !!nameState.trim()

    const footerActions = useMemo(() => {

        const res: UiBtnProps[] = []

        res.push({
            label: 'Сохранить',
            loading: userEditModel.saveProfileData.pending,
            disabled: !nameValid,
            onPress: async () => {
                const newUserData = await userEditModel.saveProfileData({type: 'name', payload: nameState})
                console.log('newUserData', newUserData)
                if (newUserData) {
                    dialog.hide()
                    onSaved && onSaved(newUserData)
                }
            }
        })

        return res
    }, [nameState, nameValid, onSaved, userEditModel.saveProfileData.pending])

    const inputRef = useRef<UiTextFieldApi>(null as any)

    return <UiBottomSheet
        id={'profile-edit'}
        isVisible={dialog.visible}
        autoHeight={true}
        onClose={dialog.hide}
        preset={'default'}
        title={'Изменить имя'}
        footerActions={footerActions}
        //footerDynamic={true}
        onShow={() => {
            setTimeout(() => {
                inputRef.current?.focus()
            }, 500)
        }}
    >
        <View marginV-30 gap-16 style={{minHeight: 100}}>
            <UiTextField
                ref={inputRef}
                placeholder={'Ваше имя'}
                presets={['outline', 'md']}
                floatingPlaceholder={true}
                value={nameState}
                onChangeText={setNameState}
                rules={[
                    {type: 'required'}
                ]}
            />
        </View>
    </UiBottomSheet>
})


const ChildDialog = observer((
    {
        userEditModel,
        childModel,
        dialog
    }: {
        userEditModel: UserEditableModel,
        childModel: UserFamilyInput,
        dialog: TBottomSheetScope
    }
) => {
    const {user} = useStores()

    const [childModelState, setChildModelState] = useState<UserFamilyInput>(childModel)

    const refs = {
        name: React.useRef(null),
        date: React.useRef(null),
    }

    useWatch(() => {
        setChildModelState(childModel)
    }, [childModel])


    const onSave = useCallback(async () => {
        if (userEditModel) {
            if (validateRefs(refs, 'all', 'first') === true) {


                const res = await userEditModel.saveChild({
                    child: childModelState
                })
                if (res.state?.success && res.user?.FAMILY) {
                    user.setFamily(res.user.FAMILY)
                    dialog.hide()
                }
            }
        }
    }, [childModelState])

    const onDelete = useCallback(async () => {
        if (userEditModel) {
            const res = await userEditModel.saveChild({
                child: childModelState
            })
            if (res.state?.success && res.user?.FAMILY) {
                user.setFamily(res.user.FAMILY)
                dialog.hide()
            }
        }
    }, [childModelState])


    const footerActions = useMemo(() => {
        const res: UiBtnProps[] = []

        if (!childModelState.ID || childModel.NAME !== childModelState.NAME) {
            res.push({
                label: 'Сохранить',
                loading: userEditModel.saveChild.pending,
                onPress: onSave,
                disabled: !childModelState.NAME || !childModelState.BIRTHDAY
            })
        }

        /*
        if (childModelState.ID) {
            res.push({
                label: 'Удалить',
                loading: userEditModel.deleteChild.pending,
                onPress: onSave,
                color: COLORS.primary,
                outline: true
            })
        }
         */

        return res
    }, [childModelState, onSave, userEditModel.saveChild.pending])


    return <UiBottomSheet
        isVisible={dialog.visible}
        autoHeight={true}
        onClose={dialog.hide}
        preset={'default'}
        title={!childModelState.ID ? 'Добавить ребенка' : 'Изменить данные'}
        footerActions={footerActions}
    >
        <View
            style={{height: footerActions.length}}
        />
        <View marginV-30 gap-25 style={{minHeight: 100}}>

            <UiTextField
                placeholder={'Имя'}
                presets={['outline', 'md']}
                floatingPlaceholder={true}
                value={childModelState.NAME || ''}
                onChangeText={(v) => setChildModelState({
                    ...childModelState,
                    NAME: v
                })}
                rules={[
                    {type: 'required'}
                ]}
                ref={refs.name}
            />
            <View>
                <UiDate
                    ref={refs.date}
                    value={childModelState.BIRTHDAY}
                    onChangeText={(val) => {
                        setChildModelState({
                            ...childModelState,
                            BIRTHDAY: val
                        })
                    }}
                    editable={!childModelState.ID}
                    rules={[
                        (val: string) => {
                            const v = dayjs(val, 'DD.MM.YYYY')
                            const now = dayjs(Date.now())
                            const years = now.diff(v, 'year')
                            const minutes = now.diff(v, 'minute')
                            if (years > 16) {
                                return 'Возраст ребенка должен быть меньше 16 лет'
                            } else if (minutes < 0) {
                                return 'Неверная дата'
                            } else {
                                return true
                            }
                        }
                    ]}
                    renderInput={(p) => {
                        return <UiTextField
                            presets={['outline', 'sm']}
                            placeholder={'Дата рождения'}
                            floatingPlaceholder={true}
                            value={childModelState.BIRTHDAY}
                            readonly={true}
                            readonlyColorPreserve={true}
                            {...(p as any)}
                        />
                    }}
                />
                {childModelState.ID && <View marginT-5>
                    <Text text-sm-lh1 red20>Изменить дату рождения можно только через оператора</Text>
                </View>}
            </View>
        </View>

    </UiBottomSheet>
})

export const ProfileEditScreen: React.FC<TScreenProps> = observer(({route: any}) => {

    const {user} = useStores()

    const nav = useNavigation()

    const {} = useStores()
    const {} = useServices()

    const refs = {
        name: useRef<UiTextFieldApi | null>(null),
        phone: useRef<UiTextFieldApi | null>(null),
        birthday: useRef<UiDatePublicMethods | null>(null),
        props: useRef<UiContentPublicMethods | null>(null)
    }

    const {chunks} = usePage<
        {
            options: {
                emailChangeable: boolean,
            },
            header: string,
            personalBirthdayGiftDesc: string,
            childBirthdayGiftDesc: string,
            commonBirthdayGiftDesc: string,
        }
    >({
        path: '/user/profile-edit',
        defaults: {
            options: {
                emailChangeable: false,
            },
        },
    })

    const {options} = chunks

    user.userEdit()

    const userEditModel = user.userEditable || new UserEditableModel({} as TUserEditableModelFields)
    const userModel = user.user

    const [childModel, setChildModel] = useState<UserFamilyInput | null>(null)

    useFocusEffect(() => {
        nav.setOptions({
            ...options,
            tabBarHide: true
        })
    })

    const profileGiftUsed = user.user?.PROFILE_GIFT_USED

    const emailDialog = useBottomSheetScope({})
    const nameDialog = useBottomSheetScope({})
    const birthdayDialog = useBottomSheetScope({})
    const childDialog = useBottomSheetScope({})

    const onChildCreate = useCallback(async () => {
        setChildModel({
            NAME: '',
            BIRTHDAY: ''
        } as UserFamilyInput)
        childDialog.show()
    }, [])


    const steps = useMemo<TProfileStep[]>(() => {
        return [
            {
                name: 'name',
                filled: !!userEditModel.NAME
            },
            {
                name: 'email',
                filled: !!userEditModel.EMAIL
            },
            {
                name: 'birthday',
                filled: !!userEditModel.PERSONAL_BIRTHDAY
            },
        ]
    }, [
        userEditModel.NAME,
        userEditModel.EMAIL,
        userEditModel.PERSONAL_BIRTHDAY
    ])

    const getStepsFilled = (steps: TProfileStep[]) => {
        return steps.filter(step => step.filled)
    }

    const stepsFilled = useMemo(() => {
        return getStepsFilled(steps)
    }, [steps])

    const stepsFilledAll = useMemo(() => {
        return stepsFilled.length >= steps.length
    }, [stepsFilled, steps])

    const onProfileDataSaved = useCallback(async (userData: User) => {
        user.setUser(userData)
        user.userEdit(true)
        if (!profileGiftUsed && getStepsFilled(steps).length >= steps.length) {
            await user.mutateProfileAllFilled({})
        } else {
            user.emitProfileUpdated()
        }
    }, [profileGiftUsed])

    const onBirthdayChangeCommit = useCallback(async (val: string) => {
        const newUserData = await userEditModel.saveProfileData({
            type: 'birthday',
            payload: val
        })
        if (newUserData)
            onProfileDataSaved(newUserData)
    }, [])

    const onBirthdayChange = useCallback(async (val: string) => {
        Alert.alert(
            'Подтвердите сохранение',
            'Указана дата рождения ' + val + '. После сохранения изменить дату рождения можно будет только через оператора',
            [
                {
                    text: "Сохранить дату",
                    onPress: () => onBirthdayChangeCommit(val),
                    style: 'default',
                    isPreferred: true
                },
                {
                    text: "Отмена",
                    style: 'cancel'
                },
            ]
        )
    }, [])

    const locked = user.mutateProfileAllFilled.pending

    if (!userEditModel || !userModel)
        return <></>

    return <UiScreen preset={'profile'}>


        <View gap-16>

            {
                !!chunks.commonBirthdayGiftDesc && <UiCard
                    preset={'formGroup'}
                >
                    <UiContentRender content={chunks.commonBirthdayGiftDesc}/>
                </UiCard>
            }

            {!profileGiftUsed && <View gap-10>
                {!!chunks.header && <UiContentRender content={chunks.header}/>}
                {
                    stepsFilledAll && <UiBtn
                        label={'Нажмите чтобы получить подарок'}
                        onPress={user.mutateProfileAllFilled}
                        loading={user.mutateProfileAllFilled.pending}
                    />
                }
            </View>}

            {
                !userEditModel.PHONE && <UiCard title={'Номер телефона'} preset={'formGroup'}>
                    <UiTextField
                        ref={refs.phone}
                        placeholder={'Телефон'}
                        presets={['outline', 'sm']}
                        floatingPlaceholder={true}
                        value={userEditModel.PHONE}
                        onChangeText={(text) => userEditModel.setFieldValue('PHONE', text)}
                        mask={INPUT_MASK_PHONE}
                        rules={[{type: 'required'}]}
                        readonly={true}
                    />
                </UiCard>
            }

            <UiCard
                title={'Ваши данные'}
                preset={'formGroup'}
                headerSide={
                    <View>
                        <Text text-xs-m-lh0 green10>
                            заполнено {stepsFilled.length} из {steps.length}
                        </Text>
                    </View>
                }
            >
                <View gap-20>
                    <UiTextField
                        ref={refs.name}
                        placeholder={'Ваше имя'}
                        presets={['outline', 'sm']}
                        floatingPlaceholder={true}
                        value={userEditModel.NAME}
                        rules={[{type: 'required'}]}
                        onChangeText={(text) => userEditModel.setFieldValue('NAME', text)}
                        done={!!userEditModel.NAME}
                        doneIcon={true}
                        readonly={true}
                        readonlyColorPreserve={true}
                        onPress={() => {
                            if (locked)
                                return;
                            nameDialog.show()
                        }}
                    />
                    <UiTextField
                        placeholder={'E-mail'}
                        presets={['outline', 'sm']}
                        floatingPlaceholder={true}
                        value={userEditModel.EMAIL}
                        onChangeText={(text) => userEditModel.setFieldValue('EMAIL', text)}
                        rules={[{type: 'email'}]}
                        onPress={() => {
                            if (locked)
                                return;
                            if (!userModel?.EMAIL || options.emailChangeable)
                                emailDialog.show()
                        }}
                        done={!!userEditModel.EMAIL}
                        doneIcon={true}
                        readonly={true}
                        readonlyColorPreserve={true}
                    />
                    <View>
                        <UiDate
                            value={userEditModel?.PERSONAL_BIRTHDAY}
                            onChangeText={onBirthdayChange}
                            editable={!userEditModel?.PERSONAL_BIRTHDAY}
                            renderInput={(p) => {
                                return <UiTextField
                                    presets={['outline', 'sm']}
                                    placeholder={'Дата рождения'}
                                    floatingPlaceholder={true}
                                    value={userEditModel?.PERSONAL_BIRTHDAY}
                                    readonly={true}
                                    readonlyColorPreserve={true}
                                    done={!!userEditModel?.PERSONAL_BIRTHDAY}
                                    doneIcon={true}
                                    {...(p as any)}
                                />
                            }}
                        />
                        {!!chunks.personalBirthdayGiftDesc &&
                            <UiContentRender content={chunks.personalBirthdayGiftDesc}/>}
                    </View>

                </View>

            </UiCard>


            <UiCard
                title={'Ваши дети'}
                preset={'formGroup'}
            >
                <UiList
                    itemPreset={['rows']}
                    itemProps={{showMore: true}}
                    items={userEditModel.FAMILY.map((item) => ({
                        label: item.NAME,
                        sideSlot: <Text>{item.BIRTHDAY}</Text>,
                        onPress: () => {
                            setChildModel({
                                ID: item.ID,
                                NAME: item.NAME,
                                BIRTHDAY: item.BIRTHDAY
                            } as UserFamilyInput)
                            childDialog.show()
                        },
                        showMore: false
                    }))}
                    gap-10
                    marginB-12
                />

                {!!chunks.childBirthdayGiftDesc && <UiContentRender content={chunks.childBirthdayGiftDesc}/>}

                <UiBtn
                    onPress={onChildCreate}
                    label={'добавить ребенка'}
                    outline={true}
                    size={'medium'}
                    color={COLORS.primary}
                />
            </UiCard>

            {
                (!!userEditModel?.PERSONAL_BIRTHDAY || !!userEditModel.FAMILY.length) &&
                <View marginH-15>
                    <Text text-sm-r-lh1 red20 center>
                        Внимание: изменить свою дату рождения или дату рождения детей возможно только через операторов
                        колл-центра по номеру 506-130
                    </Text>
                </View>
            }

        </View>


        <EmailDialog
            userEditModel={userEditModel}
            dialog={emailDialog}
            onSaved={onProfileDataSaved}
        />

        <NameDialog
            userEditModel={userEditModel}
            dialog={nameDialog}
            onSaved={onProfileDataSaved}
        />


        {childModel && <ChildDialog
            userEditModel={userEditModel}
            dialog={childDialog}
            childModel={childModel}
        />}

    </UiScreen>
})

const styles = StyleSheet.create({
    card: {
        gap: 20
    },
    codeRoot: {
        gap: 10
    },
    codeCell: {
        width: '100%',
        height: 60,
        borderRadius: 10,
        lineHeight: 38,
        fontSize: 28,
        borderWidth: 1,
        borderColor: '#00000030',
        textAlign: 'center',
        paddingVertical: 8
    },
    focusCell: {
        borderColor: '#000',
    },
})

export default ProfileEditScreen

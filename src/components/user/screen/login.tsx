import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {StyleSheet} from 'react-native';
import {observer} from 'mobx-react';
import {useStores} from '~stores';
import dayjs from "dayjs";

import {Checkbox, Text, TouchableOpacity, View} from 'react-native-ui-lib';
import {UiScreen} from '~ui/screen';

import {TScreenProps} from "@core/main/types";
import {COLORS, SPACE} from "~assets/design";
import {useNavigation} from "@react-navigation/native";
import {UiTextFieldApi} from "~ui/text-field";
import checkPhone from "@core/main/util/validate/checkPhone";
import {useCountdown} from "@core/main/lib/hooks/useCountdown";
import {duration} from "@core/main/util/date";
import MUTATE_LOGIN_START from '@core/user/gql/mutation/login_start';
import MUTATE_LOGIN_REQUEST from '@core/user/gql/mutation/login_request';
import MUTATE_LOGIN_CONFIRM from '@core/user/gql/mutation/login_confirm';
import {useWatch} from "@core/main/lib/hooks/useWatch";
import {task} from "@core/main/lib/decorator/task";
import {CaptchaInput, CaptchaModel, UserAuthConfirm} from "~gql/api";
import {UiBtn, UiBtnProps} from "~ui/btn";
import {useFocusEffect} from "expo-router";
import {useServices} from "~services";
import {UiInputPhone} from "~ui/input-phone";
import AppConfig from "@core/main/config";
import {CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell} from 'react-native-confirmation-code-field';
import {iconResolve} from "~ui/icon-resolver";
import {UiContentRender} from "~ui/content-builder/render";
import excludeEmptyFields from "@core/main/util/base/excludeEmptyFields";
import {UiPressable} from "~ui/pressable";
import {NavHeaderOptions} from "~com/app/layout/mobile/header";
import {useRefSet} from "@core/main/lib/hooks/useRefSet";

type TStep = 'start' | 'request' | 'confirm'

export const LoginScreen: React.FC<TScreenProps> = observer(({route}) => {

    //const screenSize = useScreenSize()

    const nav = useNavigation()

    const {
        user,
        router: routerStore,
        debug,
        menu,
        captchaDialog
    } = useStores()

    const {bus, linking} = useServices()

    const refs = {
        phone: useRef<UiTextFieldApi>(null as any),
        code: useRef<UiTextFieldApi>(null as any),
    }

    const providerCode = useRefSet(user.authConfirmProviderCode)

    const [phoneState, setPhoneState] = useState(user.phoneInput || '7')

    const [codeState, setCodeState] = useState('')
    const codeRef = useBlurOnFulfill({value: codeState, cellCount: 4});

    const [stepState, setStepState] = useState<TStep>('start')

    const [captchaModelState, setCaptchaModelState] = useState<CaptchaModel>()
    const [captchaInputState, setCaptchaInputState] = useState<CaptchaInput>()

    const [isFakeState, setIsFakeState] = useState(false)

    const [confirmModes, setConfirmModes] = useState<UserAuthConfirm[]>([])

    const confirmMode = confirmModes.find(item => item.CODE === user.authConfirmProviderCode)

    const [rateTime, {startCountdownWithTime, resetCountdown}] = useCountdown({countStart: 0})

    const rateDuration = rateTime > 0 ? duration(dayjs(), dayjs().subtract(rateTime, 'second')) : null

    const sendLabel = rateTime ? 'Отправить снова через ' + rateDuration : 'Войти'
    const resendLabel = rateTime ? 'Отправить снова через ' + rateDuration : 'Отправить снова'

    const codeIsValid = useMemo(() => {
        return codeState.length === 4
    }, [codeState])

    const [codeFieldProps, getCellOnLayout] = useClearByFocusCell({
        value: codeState,
        setValue: setCodeState,
    });


    const phoneUpdateExternal = useCallback((phone: string) => {
        setPhoneState(phone)
    }, [])

    useWatch(() => {
        if (codeIsValid)
            onConfirm(codeState)
    }, [codeIsValid])


    useWatch(() => {
        nav.setOptions(getNavScreenOptions())
    }, [stepState])

    useEffect(() => {

        bus.emitter.on('user:phone.update', phoneUpdateExternal)
        return () => {
            bus.emitter.off('user:phone.update', phoneUpdateExternal)
        }
    })

    const _setStepState = (newStep: TStep) => {
        setStepState(newStep)
        if (newStep === 'confirm') {
            codeRef.current?.focus()
            setCodeState('')
        }
    }

    const resetPhone = () => {
        setPhoneState('')
        user.setPhone('')
    }

    const setPhone = (v: string) => {
        resetCountdown()
        setPhoneState(v)
        const _phone = 7 + v
        if (checkPhone(_phone)) {
            user.setPhone(_phone)
        } else {
            user.setPhone('')
        }
    }

    const onStart = useCallback(task(async () => {

        console.log('onStart')

        debug.info('Screen.Login:onStart', {
            phone: phoneState,
        })

        if (refs.phone.current?.validate() !== true || !phoneState)
            return;

        try {

            const res = await MUTATE_LOGIN_START.request({
                variables: {
                    phone: phoneState,
                    captcha: captchaInputState,
                },
                context: {headers: {'x-timeout': 10000}}
            }, {
                log: true
            })

            if (res && res.state.success) {

                if (res.confirmModes)
                    setConfirmModes(res.confirmModes)

                if (res.state.rateLimitTtl)
                    startCountdownWithTime(res.state.rateLimitTtl)

                _setStepState('request')
            }

        } catch (e) {
            console.log(e)
        }

    }), [phoneState])

    const onRequest = useCallback(task(async () => {

        debug.info('Screen.Login:onRequest', {
            confirmMode: providerCode.current,
            phone: phoneState,
        })

        try {
            const res = await MUTATE_LOGIN_REQUEST.request({
                variables: {
                    confirmMode: providerCode.current,
                    phone: phoneState,
                },
                context: {headers: {'x-timeout': 10000}}
            }, {
                log: true
            })

            if (res && res.state.success) {
                if (res.state.rateLimitTtl)
                    startCountdownWithTime(res.state.rateLimitTtl)
                _setStepState('confirm')
            }

        } catch (e) {
            console.log(e)
        }

    }), [phoneState])

    const onConfirm = useCallback(task(async (codeValue?: string) => {
        try {
            const res = await MUTATE_LOGIN_CONFIRM.request({
                variables: {
                    confirmMode: user.authConfirmProviderCode,
                    phone: phoneState,
                    code: codeValue || codeState
                },
            }, {log: true})

            if (res.state.success) {
                await user.onAuth({
                    appClient: res.appClient,
                    sessionId: res.sessionId,
                    userId: res.userId
                })
                user.onLoginSuccess()
            }
        } catch (e) {
            console.log(e)
        }
    }), [phoneState, codeState, user.authConfirmProviderCode])

    const onSelectProvider = useCallback((item: UserAuthConfirm) => {
        user.setAuthConfirmProviderCode(item.CODE as any)
        setTimeout(() => {
            onRequest()
        }, 200)
    }, [onRequest])

    const loading = onStart.pending || onRequest.pending || onConfirm.pending
    const phoneStateValid = checkPhone(phoneState)
    const requestEnable = phoneStateValid && !rateTime

    const components = {
        codeInput: () => {

            return <View centerH key={'codeInput'} gap-13>

                <Text center text-lg-m>Введите код</Text>

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
        }
    }

    const vars = {
        phone: phoneState
    }


    const steps = {
        start: {
            onBack: () => {

            },
            actions: () => {
                return [
                    {
                        label: sendLabel,
                        onPress: () => onStart(),
                        disabled: !requestEnable,
                        loading: onStart.pending
                    },
                ]
            },
            body: () => {
                return <View>

                    <View marginB-30>
                        <Text text-xxl-h marginB-10>{`Добро пожаловать!`}</Text>
                        <Text>Войдите с помощью номера телефона</Text>
                        <Text>Это нужно будет сделать всего один раз.</Text>
                    </View>

                    <UiInputPhone
                        placeholder={'Ваш телефон'}
                        presets={['outline', 'md']}
                        value={phoneState}
                        //autoFocus
                        onChangeText={setPhone}
                        onSubmitEditing={() => onRequest()}
                        enterKeyHint={requestEnable ? 'done' : undefined}
                        required={true}
                        resetErrorsOnChange={true}
                        ref={refs.phone}
                        clearable={true}
                    />

                    {debug.adminMode && <View marginT-20 gap-20>
                        <Checkbox
                            value={isFakeState}
                            onValueChange={(v: boolean) => setIsFakeState(v)}
                            label={'Фейк отправка'}
                        />
                    </View>}

                    <TouchableOpacity
                        marginT-30
                        row
                        onPress={() => menu.runActionItem(AppConfig.APP_CONSENT_ACTION)}
                        style={{gap: 10}}
                    >
                        <Checkbox color={COLORS.primary} size={20} value={true} disabled={true}/>
                        <View flexS>
                            <Text text-xs-lh2 grey30>
                                Заполняя личные данные вы принимаете
                                {SPACE}
                                <Text text-xs-lh2 primaryLighter style={{textDecorationLine: 'underline'}}>
                                    Соглашение в отношении обработки персональных данных
                                </Text>
                            </Text>
                        </View>
                    </TouchableOpacity>

                </View>
            },
        },
        request: {
            onBack: () => {
                _setStepState('start')
            },
            actions: () => {
                return [] as UiBtnProps[]
            },
            body: () => {
                return <View>

                    <View marginB-30>
                        <Text text-xl-h marginB-10>Способ подтверждения номера</Text>
                        <Text text-sm>Чтобы подтведить свой номер телефона используйте один из вариантов ниже</Text>
                    </View>

                    <View gap-20>
                        {
                            confirmModes.map((item) =>
                                <UiPressable
                                    key={item.CODE}
                                    br-md row gap-5 paddingH-12 paddingV-15
                                    style={{
                                        borderWidth: 1,
                                        borderColor: COLORS.grey40
                                    }}
                                    onPress={() => {
                                        if (item.LIST_BUTTON_MOBILE)
                                            menu.runAction(item.LIST_BUTTON_MOBILE.action)

                                        onSelectProvider(item)
                                    }}
                                >
                                    <View flex-2 style={{width: 40}}>
                                        {iconResolve(item.ICON, {size: 40, color: item.COLOR})}
                                    </View>
                                    <View flex-12 gap-10>
                                        <Text text-lg-m-lh1>{item.LIST_NAME}</Text>
                                        <Text text-sm>{item.LIST_CAPTION}</Text>
                                        <UiBtn
                                            iconSize={30}
                                            paddingV-6
                                            backgroundColor={item.COLOR}
                                            outlineColor={COLORS.white}
                                            {...excludeEmptyFields(item.LIST_BUTTON_MOBILE)}
                                            loading={loading && user.authConfirmProviderCode === item.CODE}
                                            onPress={() => onSelectProvider(item)}
                                        />
                                    </View>
                                </UiPressable>
                            )
                        }
                    </View>

                </View>
            }
        },
        confirm: {
            onBack: () => {
                _setStepState('request')
            },
            actions: () => {
                return [
                    {
                        label: 'Подтвердить',
                        onPress: onConfirm,
                        loading: onConfirm.pending,
                        disabled: !codeIsValid
                    },
                    {
                        label: resendLabel,
                        link: true,
                        color: COLORS.primary,
                        onPress: onRequest,
                        loading: onRequest.pending,
                        disabled: rateTime > 0 || loading,
                        hideOnKeyboard: true
                    },
                ] as UiBtnProps[]
            },
            body: () => {
                return <View>


                    {!!confirmMode && !!confirmMode.CONFIRM_CONTENT_MOBILE &&
                        <UiContentRender
                            content={confirmMode.CONFIRM_CONTENT_MOBILE}
                            vars={vars}
                            components={components}
                            deps={[codeState]}
                        />
                    }
                </View>
            }
        },
    }

    const stepInfo = steps[stepState as keyof typeof steps]

    const goBack = useCallback(() => {
        if (stepInfo && stepInfo.onBack) {
            stepInfo.onBack()
        }
    }, [stepState])

    const getNavScreenOptions = useCallback(() => {

        let options: Partial<NavHeaderOptions> = {
            headerRightActions: [
                {
                    label: 'Пропустить',
                    onPress: () => user.onLoginSkip()
                }
            ],
        }

        if (stepState !== 'start') {
            options = {
                ...options,
                headerBackLabel: 'Назад',
                headerBackHandle: goBack,
                headerBackEnable: true
            }
        } else {
            options = {
                ...options,
                headerBackEnable: false
            }
        }

        return options
    }, [stepState, goBack])

    useFocusEffect(useCallback(() => {
        console.log('setLoginScreenShown')
        routerStore.setLoginScreenShown(true)
        _setStepState('start')
    }, []))

    useFocusEffect(useCallback(() => {
        setTimeout(() => {
            nav.setOptions(getNavScreenOptions())
        }, 100)
    }, [getNavScreenOptions]))

    return <UiScreen
        bodyScroll={false}
        modifiers={{
            header: ['paddingT-10', 'paddingH-modalH'],
            body: ['paddingV-modalV', 'paddingH-modalH'],
            //footer: ['paddingH-modalH', 'paddingT-modalV', 'paddingB-40'],
        }}
        bodyValign={'middle'}
        preset={'default'}
        footerActions={stepInfo.actions()}
        keyboardAvoidingView={true}
        backgroundColor={COLORS.white}
        keyboardDismissibleView={true}
    >
        {stepInfo.body()}
    </UiScreen>
})


const styles = StyleSheet.create({

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

export default LoginScreen



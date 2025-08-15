import React, {useCallback, useEffect, useMemo, useState} from "react"
import {StyleSheet} from "react-native"

import {TScreenProps} from "@core/main/types"
import {UiScreen} from "~ui/screen"
import {Text, View} from "react-native-ui-lib"
import {UiTextField} from "~ui/text-field"
import {Rating} from "react-native-ratings"
import {UiBtnProps} from "~ui/btn";
import validateRefs from "@core/main/util/validate/validateRefs"
import API_MUTATION_SERVICE_REVIEW from "@core/review/gql/mutation/service_review"

import {useServices} from "~services"
import {observer} from "mobx-react"
import {useStores} from "~stores";
import {useFocusEffect} from "expo-router";
import {INPUT_MASK_PHONE} from "~assets/config";

type TFormState = {
    name?: string
    phone?: string
    email?: string
    comment?: string
}
export const FeedbackScreen: React.FC<TScreenProps> = observer(() => {

    const {user} = useStores()

    const [formState, setFormState] = useState<TFormState>({})
    const [step, setStep] = useState<'form' | 'sending' | 'sended'>('form')

    useFocusEffect(useCallback(() => {
        setStep('form')
    }, []))

    useEffect(() => {
        
        if (user.isAuthorized && user.user) {
            setFormState({
                name: user.user?.NAME,
                phone: user.user?.PHONE,
            })
        }
    }, [user.isAuthorized])

    const {bus} = useServices()

    const bgColor = '#FFFFFF'

    const refs = {
        name: React.useRef(null),
        phone: React.useRef(null),
        comment: React.useRef(null),
    }

    const setField = (code: string, value: string) => {
        setFormState({
            ...formState,
            ...{
                [code]: value
            }
        })
    }

    const onCommit = useCallback(async () => {
        setStep('sending')
        const res = await API_MUTATION_SERVICE_REVIEW.request({
            variables: {
                model: formState
            }
        })
        if (res.state.success) {
            setField('comment', '')
            setStep('sended')
        }
    }, [formState])

    const actions = useMemo(() => {
        const res: UiBtnProps[] = []
        if (step !== 'sended') {
            res.push({
                label: 'Отправить отзыв',
                loading: step === 'sending',
                onPress: () => {
                    if (validateRefs(refs, 'all', 'first') === true) {
                        onCommit()
                    }
                }
            })
        }
        return res
    }, [step])

    return (
        <UiScreen
            backgroundColor={'#FFFFFF'}
            preset={'default'}
            keyboardAvoidingView={true}
            footerActions={actions}
        >
            {step === 'sended' ?
                <View marginV-20>
                    <Text primary text-lg center>Отзыв успешно отправлен</Text>
                </View>
                :
                <View style={{gap: 30}}>
                    <UiTextField
                        ref={refs.name}
                        floatingPlaceholder
                        contextBackgroundColor={bgColor}
                        placeholder={'Ваше имя'}
                        presets={['outline']}
                        value={formState.name}
                        fieldStyle={{
                            backgroundColor: '#FFFFFF'
                        }}
                        font-size-md
                        onChangeText={(v) => setField('name', v)}
                    />
                    <UiTextField
                        ref={refs.phone}
                        floatingPlaceholder
                        contextBackgroundColor={bgColor}
                        placeholder={'Телефон'}
                        presets={['outline']}
                        value={formState.phone}
                        fieldStyle={{
                            backgroundColor: '#FFFFFF'
                        }}
                        mask={INPUT_MASK_PHONE}
                        rules={[
                            {type: 'required'}
                        ]}
                        font-size-md
                        onChangeText={(v) => setField('phone', v)}
                    />
                    <UiTextField
                        ref={refs.comment}
                        floatingPlaceholder
                        contextBackgroundColor={bgColor}
                        placeholder={'Ваш комментарий'}
                        presets={['outline']}
                        value={formState.comment}
                        style={{
                            height: 100
                        }}
                        fieldStyle={{
                            backgroundColor: '#FFFFFF',
                            minHeight: 100
                        }}
                        multiline
                        numberOfLines={4}
                        font-size-md
                        required={true}
                        onChangeText={(v) => setField('comment', v)}
                    />

                    <View>
                        <Text marginB-10 font-size-md>С какой вероятностью вы порекомендуете нас?</Text>
                        <Rating
                            type='star'
                            ratingCount={5}
                            imageSize={50}
                            startingValue={0}
                        />
                    </View>
                </View>
            }
        </UiScreen>
    )
})


const styles = StyleSheet.create({

    bonusCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        overflow: "hidden",
        shadowColor: '#000',
        shadowOffset: {
            width: 2,
            height: 4,
        },
        shadowOpacity: 0.34,
        shadowRadius: 10,
        justifyContent: 'space-between',
        backfaceVisibility: 'hidden',
        elevation: 2,
    },
});

export default FeedbackScreen

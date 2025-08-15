import React, {useCallback, useMemo, useState} from "react";
import VorderStore from "@core/sale/store/vorder";
import {Incubator, Text, View} from "react-native-ui-lib";
import {UiTextField} from "~ui/text-field";
import {COLORS, THEME_STYLE} from "~assets/design";
import {UiBtn, UiBtnProps} from "~ui/btn";
import {Coupon} from "~gql/api";
import icons from "~assets/icons-map";
import {TValidateErrors, TValidateResult} from "@core/main/types"
import errorsPrepare from "@core/main/util/validate/errorsPrepare";
import testRules from "@core/main/util/validate/testRules";
import toInt from "@core/main/util/base/toInt";
import {useStores} from "~stores";
import {useWatch} from "@core/main/lib/hooks/useWatch";
import {useStateRef} from "@core/main/lib/hooks/useStateRef";

const Slider = Incubator.Slider

type TContext = {
    close: any
}

const SliderWithInput: React.FC<{
    value: number,
    onChangeValue: (v: number) => void
}> = ({value, onChangeValue}) => {

    const {vorder} = useStores()

    const [valueState, setValueState, valueStateRef, updateValueState] = useStateRef<number>(value)
    const [changedTextVersion, setChangedTextVersion] = useState<number>(0)

    useWatch(() => {
        console.log('watch')
        updateValueState(value)
    }, [value])

    const correctValue = (v: number) => {
        if (v > vorder.bonusesMax)
            return vorder.bonusesMax
        else if (v < 0)
            return 0
        else
            return Math.round(v)
    }

    const onSliderValueChange = useCallback((num: number) => {
        const _num = correctValue(num)
        updateValueState(_num)
    }, [])

    const onSliderSeekEnd = useCallback(() => {
        onChangeValue(valueStateRef.current)
        setTimeout(() => {
            onChangeValue(valueStateRef.current)
        }, 300)
    }, [])

    const onInputValueChange = useCallback((v: string) => {
        const num = correctValue(toInt(v))
        updateValueState(num)
        onChangeValue(num)
        setChangedTextVersion((v) => v + 1)
    }, [])

    const sliderThumbSize = 30

    const slider = useMemo(() => {
        return <Slider
            value={valueState}
            step={1}
            throttleTime={10}
            containerStyle={{
                height: 20 + 4
            }}
            thumbStyle={{
                width: sliderThumbSize,
                height: sliderThumbSize,
                borderRadius: sliderThumbSize / 2,
            }}
            minimumTrackTintColor={COLORS.primary}
            thumbTintColor={COLORS.primary}
            minimumValue={-vorder.bonusesMax * 0.1}
            maximumValue={vorder.bonusesMax + vorder.bonusesMax * 0.1}
            onValueChange={onSliderValueChange}
            onSeekEnd={onSliderSeekEnd}
        />
    }, [changedTextVersion, vorder.bonusesMax, onSliderValueChange, onSliderSeekEnd])

    return <View row centerV gap-10>
        <View centerH>
            <UiTextField
                value={valueState > 0 ? valueState.toString() : '0'}
                presets={['outline', 'lg']}
                style={{
                    width: 50,
                    textAlign: 'center',
                    fontWeight: '900',
                    fontSize: 20
                }}
                onChangeText={onInputValueChange}
                keyboardType={'numeric'}
            />
        </View>
        <View paddingH-10 flexG gap-2>
            {slider}
        </View>
    </View>
}

export function useBonus(vorder: VorderStore, context: TContext) {

    const {faqDialog, router, pageDialog} = useStores()
    const [bonusesState, setBonusesState] = useState(vorder.bonuses)
    const bonusesStateStr = bonusesState ? bonusesState.toString() : ''

    const actions = useMemo(() => {
        const res: UiBtnProps[] = []
        if (vorder.bonusesMax && bonusesState < vorder.bonusesMax) {
            res.push({
                label: 'Использовать все бонусы',
                outline: !bonusesState,
                link: !!bonusesState,
                color: COLORS.primary,
                containerStyle: {
                    paddingBottom: 10,
                    paddingTop: 0,
                    //borderWidth: 1
                },
                onPress: () => {
                    setBonusesState(vorder.bonusesMax)
                    setTimeout(() => {
                        context.close()
                    }, 300)
                }
            })
        }

        if (bonusesState) {
            res.push({
                label: 'Использовать ' + bonusesState + ' бонусов',
                onPress: () => context.close(),
            })
        }

        return res
    }, [
        bonusesState,
        context.close,
        vorder.bonusesMax
    ])

    const validateResult = useMemo(() => {
        return testRules('first', vorder.getRulesBonus(), bonusesState)
    }, [bonusesState])

    const onOpen = () => {

    }

    const content =
        <View>
            {
                !vorder.bonusesAvailable ?
                    <View marginB-10>
                        <Text text-lg-m center>У вас нет бонусов</Text>
                    </View>
                    :
                    <View gap-20 marginB-10>

                        <View gap-10 row centerV paddingH-10>
                            <View>
                                <Text text-md-lh0 center>Количество бонусов:</Text>
                            </View>
                            <View marginL-auto>
                                <Text text-md-m-lh0>{vorder.bonusesAvailable}</Text>
                            </View>
                        </View>

                        <View gap-10 row centerV paddingH-10>
                            <View>
                                <Text text-md-lh0 center>Можно использовать:</Text>
                            </View>
                            <View marginL-auto>
                                <Text text-md-bo-lh0 green20>до {vorder.bonusesMax}</Text>
                            </View>
                        </View>

                        <View paddingH-10 row centerV>
                            <Text center text-sm-r-lh0>До {vorder.bonusesMaxPercent}% от суммы заказа</Text>
                            <View marginL-auto>
                                <UiBtn
                                    backgroundColor={COLORS.white}
                                    color={COLORS.primary}
                                    size={'small'}
                                    label={'подробнее'}
                                    text-sm-lh0
                                    icon={icons.circleQuestion}
                                    link={true}
                                    onPress={() => {
                                        pageDialog.show({
                                            code: '/bonuses-info'
                                        })
                                    }}
                                />
                            </View>
                        </View>


                        <SliderWithInput
                            value={bonusesState}
                            onChangeValue={(v) => {
                                setBonusesState(v)
                            }}
                        />

                    </View>
            }

        </View>


    return {
        bonusesState,
        bonusesStateStr,
        setBonusesState,
        actions,
        content,
        validateResult,
        onOpen
    }
}

export function useCoupon(vorder: VorderStore, context: TContext) {

    const {faqDialog} = useStores()
    const [errors, setErrors] = useState<TValidateErrors>([])
    const [couponCode, setCouponCode] = useState('')
    const [state, setState] = useState<'input' | 'error' | 'success_added' | 'success_deleted'>('input')

    const validateResult = useMemo(() => {
        return true
    }, [couponCode])

    const onCouponApply = useCallback(async () => {
        const res = await vorder.apiMutateCoupon({
            action: 'apply',
            couponCode: couponCode
        })
        if (res.state.success) {
            setState('success_added')
        } else {
            setState('error')
        }
    }, [couponCode])

    const onCouponDelete = async (coupon: Coupon) => {
        const res = await vorder.apiMutateCoupon({
            action: 'delete',
            couponCode: coupon.COUPON
        })
        if (res.state.success) {
            setCouponCode('')
            setState('success_deleted')
        } else {
            setState('error')
        }
    }

    const onOpen = () => {
        setErrors([])
        setState(!vorder.coupon ? 'input' : 'success_added')
    }

    const actions = useMemo(() => {
        const res: UiBtnProps[] = []
        if (!vorder.coupon) {
            res.push({
                label: 'Применить промокод',
                disabled: !couponCode,
                onPress: onCouponApply,
                loading: vorder.apiMutateCoupon.pending
            })
        }
        return res
    }, [couponCode, vorder.coupon, onCouponApply, vorder.apiMutateCoupon.pending])

    const content = vorder.coupon ?
        <View row paddingR-4>
            <View flex-9>
                <Text font-size-lg bold-8>{vorder.coupon.COUPON && vorder.coupon.COUPON.toUpperCase()}</Text>
            </View>
            <View flex-3>
                <UiBtn
                    onPress={() => onCouponDelete(vorder.coupon as Coupon)}
                    label={'удалить'}
                    link
                    icon={icons.del}
                    iconSize={25}
                />
            </View>
        </View>
        :
        <View>
            <UiTextField
                editable={!vorder.apiMutateCoupon.pending}
                placeholder={'Введите промокод'}
                floatingPlaceholder
                value={couponCode}
                autoFocus={false}
                styleColor={COLORS.primary}
                presets={['outline', 'md']}
                onChangeText={(v: any) => {
                    setCouponCode(v)
                }}
            />
            <UiBtn
                marginT-20
                backgroundColor={COLORS.white}
                color={COLORS.primary}
                label={'подробнее о промокодах'}
                icon={icons.circleQuestion}
                link={true}
                onPress={() => {
                    faqDialog.show({
                        openSection: 'coupon'
                    })
                }}
            />
        </View>

    return {
        content,
        couponCode,
        setCouponCode,
        onCouponApply,
        onCouponDelete,
        validateResult,
        actions,
        onOpen
    }
}

export function useDiscount(vorder: VorderStore, context: TContext) {
    const {faqDialog} = useStores()

    const [errors, setErrors] = useState<TValidateErrors>([])
    const [couponCode, setCouponCode] = useState('')

    const validateResult = useMemo(() => {
        return errorsPrepare(errors) as TValidateResult
    }, [errors])

    const onOpen = () => {
        setErrors([])
    }

    const actions = useMemo(() => {
        const res: UiBtnProps[] = []
        res.push({
            label: 'Применить скидку',
            onPress: () => {
                context.close()
            }
        })
        return res
    }, [])

    const content = <View>
        {vorder.discountBest && <View bg-white marginV-5 marginH-3 padding-10 br40 style={THEME_STYLE.shadow2}>
            <Text text-md-lh0 center style={{width: '100%', textAlign: 'center'}}>
                {vorder.discountBest.getTemplatedReact(
                    'NAME_TEMPLATE',
                    (v) => <Text text-sm-bo-lh0 key={1}>{v}</Text>
                )}
            </Text>
        </View>}
        <UiBtn
            marginT-20
            backgroundColor={COLORS.white}
            color={COLORS.primary}
            label={'подробнее о скидках'}
            icon={icons.circleQuestion}
            link={true}
            onPress={() => {
                faqDialog.show({
                    openSection: 'discount'
                })
            }}
        />
    </View>


    return {
        content,
        couponCode,
        setCouponCode,
        validateResult,
        actions,
        onOpen
    }
}

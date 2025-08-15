import React, {useCallback, useMemo, useRef, useState} from "react"
import {StyleSheet} from "react-native"
import {observer} from "mobx-react"
import {useStores} from "~stores"
import {TBottomSheetOnClose, UiBottomSheet, UiBottomSheetMethods} from "~com/ui/bottom-sheet";
import {Text, View} from "react-native-ui-lib";
import {TBenefitTypeValue} from "@core/sale/types";
import {useBonus, useCoupon, useDiscount} from "./hooks";
import {UiMessages} from "~ui/messages";
import {UiSegments} from "~ui/segments";
import {COLORS} from "~assets/design";
import {TValidateResult} from "@core/main/types";
import {useServices} from "~services";

export const VorderBenefitDialog: React.FC = observer(() => {

    const {vorder} = useStores()
    const {bus} = useServices()

    const [benefitTypeState, setBenefitTypeState] = useState<TBenefitTypeValue | null>(() => {
        return vorder.dialogs.benefit.props.benefitType || vorder.benefitType
    })

    const refs = {
        sheet: useRef<UiBottomSheetMethods>(null as any),
    }

    const [tabChanged, setTabChanged] = useState(false)
    const [changed, setChanged] = useState(false)

    const benefitTypeStateInfo = vorder.benefitTypes.find(item => item.VALUE === benefitTypeState)

    const title = benefitTypeStateInfo ? benefitTypeStateInfo.NAME : 'Бонусы'

    const options = useMemo(() => vorder.benefitTypes.map(item => ({
        label: benefitTypeState === item.VALUE ? item.NAME : item.NAME,
        value: item.VALUE
    })), [vorder.benefitTypes])

    const ctx = {
        close: useCallback(() => refs.sheet.current?.closeModal(), [])
    }

    const discountScope = useDiscount(vorder, ctx)

    const bonusScope = useBonus(vorder, ctx)

    const couponScope =
        useCoupon(vorder, ctx)

    const {setBonusesState, bonusesState} = bonusScope

    let currentScope:
        (typeof bonusScope) &
        (typeof couponScope) &
        (typeof discountScope)

    switch (benefitTypeState) {
        case 'discount':
            currentScope = discountScope as typeof currentScope
            break;
        case 'coupon':
            currentScope = couponScope as typeof currentScope
            break
        case 'bonus':
        default:
            currentScope = bonusScope as typeof currentScope
    }

    const validateResult = currentScope.validateResult as TValidateResult

    const actions = [...currentScope.actions]

    if (!actions.length) {
        actions.push({
            label: 'Готово',
            onPress: () => refs.sheet.current?.closeModal()
        })
    }

    const apply = (fromDismiss?: boolean) => {

        console.log('BT apply', fromDismiss)

        if (benefitTypeState === 'bonus')
            vorder.setPropValue('BONUSES', bonusesState, false)

        const newBenefitType = vorder.checkBenefitType(benefitTypeState)

        console.log('BT', {
            benefitTypeState,
            newBenefitType
        })

        if (!newBenefitType) {
            return true
        }

        const newBenefitTypeInfo = vorder.benefitTypesAvailableByCode[newBenefitType]

        let message = null

        if (newBenefitType !== 'bonus') {
            if (vorder.bonuses) {
                vorder.setPropValue('BONUSES', 0, false)
                message = 'Вы переключились на использование ' + newBenefitTypeInfo.NAME_IN + '. Использование бонусов будет отменено'
            }
        }

        if (newBenefitType !== 'coupon') {
            if (vorder.couponFilled) {
                vorder.couponsClear()
                vorder.setBenefitType(newBenefitType)
                message = 'Вы переключились на использование ' + newBenefitTypeInfo.NAME_IN + '. Использование промокода будет отменено'
            }
        }

        if (newBenefitType !== 'discount') {
            if (vorder.discountBest) {
                message = 'Вы переключились на использование ' + newBenefitTypeInfo.NAME_IN + '. Использование скидки отменено'
            }
        }

        if (message) {
            bus.showAlert({
                type: 'info',
                message: message,
                duration: 3500
            })
            vorder.apiMutateApply({})
        }

        if (newBenefitType) {
            vorder.setBenefitType(newBenefitType)
        }

        return true
    }

    const onClose: TBottomSheetOnClose = (fromDismiss) => {
        apply(fromDismiss)
        vorder.dialogs.benefit.hide()
    }

    let showOptions

    if (options.length > 1) {
        showOptions = true
    } else if (options.length === 1) {
        showOptions = options[0].value !== benefitTypeState
    } else {
        showOptions = false
    }

    const triggerSize = actions.length

    return <UiBottomSheet
        ref={refs.sheet}
        id={'benefit'}
        isVisible={vorder.dialogs.benefit.visible}
        title={title}
        onClose={onClose}
        preset={'default'}
        autoHeight={true}
        stackBehavior={'push'}
        footerActions={actions}
        footerIsFixed={true}
        bodyScrollable={false}
    >
        <View paddingV-20>

            {options.length > 1 &&
                <Text marginB-12 text-xs-r-lh1 center grey30>можно использовать один из вариантов:</Text>}

            {
                showOptions && <View marginB-24 paddingH-2>
                    <UiSegments
                        initialValue={benefitTypeState}
                        segments={options}
                        activeColor={COLORS.primary}
                        onChangeValue={(v: TBenefitTypeValue) => {
                            //  setTabChanged(true)
                            setBenefitTypeState(v)
                        }}
                    />
                </View>
            }

            {
                validateResult && validateResult !== true && !!validateResult.length &&
                <UiMessages
                    marginB-16
                    marginT-10
                    items={validateResult}
                />
            }

            <View>
                {currentScope.content}
            </View>

            <View style={{height: triggerSize}}/>

        </View>
    </UiBottomSheet>
})

export default VorderBenefitDialog

const styles = StyleSheet.create({})

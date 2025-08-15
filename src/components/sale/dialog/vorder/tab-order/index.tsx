import React, {useCallback, useEffect, useMemo, useState} from "react"
import {StyleSheet} from "react-native"
import {observer} from "mobx-react"
import {Checkbox, Text, View} from "react-native-ui-lib"
import {useStores} from "~stores";
import {TValidatableComponentHandle} from "@core/main/types";
import validateRefs from "@core/main/util/validate/validateRefs";
import {UiBtn, UiBtnProps} from "~ui/btn";
import {
    SectionBenefitType,
    SectionComment,
    SectionCutlery,
    SectionDelivery,
    SectionOperator,
    SectionPayment,
    SectionPhone,
    SectionPickup,
    SectionTime
} from "../section";
import {COLORS} from "~assets/design";
import {UiSegments} from "~ui/segments";
import SaleConfig from "@core/sale/config";
import Summary from "~com/sale/dialog/vorder/summary";

interface TProps {
    onSetActions: (actions: UiBtnProps[]) => void
    onSetTab: (tab: string) => void
    onClose: () => void
    active: boolean
}

export const TabOrder: React.FC<TProps> = observer(({onSetActions, onSetTab, onClose, active}) => {

    const {debug, vorder, sale, page, user, router} = useStores()

    const [needValidate, setNeedValidate] = useState(false)

    const currentPage = page.getPageByPath(SaleConfig.SALE_VORDER_SCREEN_URL)
    const pageChunks = currentPage?.chunk || {}

    const options: {
        submitConfirm: 'online-payment' | 'online-payment-without-operator' | 'all' | 'without-operator' | false
    } = {
        submitConfirm: 'without-operator',
        ...pageChunks.options,
    }

    const refs = {
        phone: React.useRef<TValidatableComponentHandle>(),
        discount: React.useRef<TValidatableComponentHandle>(),
        delivery: React.useRef<TValidatableComponentHandle>(),
        pickup: React.useRef<TValidatableComponentHandle>(),
        time: React.useRef<TValidatableComponentHandle>(),
        benefit_type: React.useRef<TValidatableComponentHandle>(),
        bonus: React.useRef<TValidatableComponentHandle>(),
        payment: React.useRef<TValidatableComponentHandle>(),
        promo: React.useRef<TValidatableComponentHandle>(),
        cutlery: React.useRef<TValidatableComponentHandle>(),
        summary: React.useRef<TValidatableComponentHandle>(),
        comment: React.useRef<TValidatableComponentHandle>(),
        operator: React.useRef<TValidatableComponentHandle>(),
    }

    const onSubmitCommit = useCallback(async () => {

        const res = await vorder.apiMutateSubmit({})

        if (res.state.success) {

            vorder.onAfterOrderSubmit()

            onSetTab('basket')

            const order = res.payload?.order

            onClose()

            setTimeout(() => {
                if (order) {
                    sale.mergeActiveOrder(order)
                    vorder.basketCloseAndRedirect({pathname: '/user/order', params: {orderId: order.ID}})
                } else {
                    router.push({pathname: '/user/orders-active'})
                }
            }, 200)
        }
    }, [])

    const getNeedConfirm = useCallback(() => {
        switch (options.submitConfirm) {
            case 'all':
                return true
            case 'online-payment':
                return vorder.attrValue.PAYMENT_TYPE === 'online'
            case 'online-payment-without-operator':
                return vorder.attrValue.PAYMENT_TYPE === 'online' && vorder.attrValue.WITH_OPERATOR === 'N'
            case 'without-operator':
                return vorder.attrValue.WITH_OPERATOR === 'N'
        }
        return false
    }, [])

    const validateBeforeSubmit = useCallback(async () => {
        if (!vorder.deliveryRequestReserveActual && vorder.deliveryFieldsEnough) {
            await vorder.deliveryRequestReserve()
        }
        return vorder.vorderValidateAll()
    }, [])

    const onSubmit = useCallback(async () => {
        if (await validateBeforeSubmit()) {
            if (getNeedConfirm()) {
                vorder.vorderDialogOpen('confirm', {
                    onSuccess: () => {
                        onSubmitCommit()
                    }
                })
            } else {
                onSubmitCommit()
            }
        }
    }, [validateBeforeSubmit])

    const actions = useMemo<UiBtnProps[]>(() => {

        if (!vorder.accessOrderForm)
            return []

        return [
            {
                disabled: vorder.mutating,
                label: 'Оформить',
                backgroundColor: COLORS.primary,
                outline: false,
                containerStyle: {
                    flex: 6
                },
                onPress: () => onSubmit()
            }
        ]
    }, [vorder.mutating, vorder.accessOrderForm])

    useEffect(() => {
        if (active) {
            onSetActions(actions)
        } else {
        }
    }, [active, actions])


    useEffect(() => {
        if (needValidate) {
            validateRefs(refs, 'all', 'first')
            setNeedValidate(false)
        }
    }, [needValidate])

    const deliveryRendered = useMemo(() => {
        return <UiSegments
            segments={vorder.deliveryOptions}
            activeColor={COLORS.primary}
            value={vorder.attrValue['DELIVERY_ID']}
            onChangeValue={(v: any) => vorder.deliveryTabChange(v)}
            throttleTime={400}
        />
    }, [vorder.deliveryOptions, vorder.attrValue['DELIVERY_ID']])

    const renderForm = () => <>

        {
            !user.isAuthorized &&
            <View style={styles.section}>
                <SectionPhone
                    ref={refs.phone}
                />
            </View>
        }

        <View style={styles.section}>
            {deliveryRendered}
        </View>

        <View style={styles.section}>

            {vorder.isTransportCourier ? (
                <SectionDelivery
                    ref={refs.delivery}
                    fullHeight={false}
                />
            ) : (
                <SectionPickup
                    ref={refs.pickup}
                    fullHeight={false}
                />
            )}

        </View>

        <View row gap-10>
            <View flex-20>
                <View flex style={styles.section}>
                    <SectionTime
                        ref={refs.time}
                        fullHeight={false}
                    />
                </View>
            </View>
            <View flex-18>
                <View flex style={styles.section}>
                    <SectionPayment
                        ref={refs.payment}
                        fullHeight={false}
                    />
                </View>
            </View>
        </View>

        <View row gap-10>
            <View flex-20>
                <View flex style={styles.section}>
                    <SectionCutlery
                        ref={refs.cutlery}
                        fullHeight={true}
                    />
                </View>
            </View>
            <View flex-18>
                <View flex style={styles.section}>
                    <SectionComment
                        ref={refs.comment}
                        fullHeight={true}
                    />
                </View>
            </View>
        </View>

        <View flex style={styles.section}>
            <SectionOperator
                ref={refs.operator}
            />
        </View>

        <View
            style={styles.sectionGroup}
            paddingB-10
            gap-10
            marginB-10
        >
            <SectionBenefitType
                ref={refs.benefit_type}
            />
        </View>

        {debug.adminMode && <View marginV-20>
            <Checkbox
                value={vorder.attrValue['SERVICE_SEND'] === 'Y'}
                onValueChange={(v: boolean) => {
                    console.log('v', v)
                    vorder.setPropValue('SERVICE_SEND', v ? 'Y' : 'N')
                }}
                label={'Отправить в 1с'}
            />
        </View>}

        <Summary
            marginB-10
            showDelivery={true}
            showBasket={true}
            showBenefit={true}
            showAddress={false}
        />
    </>

    const renderUnauthorized = () => <View gap-20 marginV-16>

        <Text text-md-lh3>Войдите в приложение под своим номером телефона для использования бонусов и скидок</Text>

        <View gap-25 marginB-10>
            <UiBtn
                label={'Войти'}
                size={'large'}
                onPress={() => vorder.navLogin()}
            />
            <UiBtn
                label={'Оформить как гость'}
                link={true}
                size={'large'}
                onPress={() => vorder.setGuestMode(true)}
            />
        </View>

    </View>

    return <View marginT-18 paddingH-15>
        {vorder.accessOrderForm ? renderForm() : renderUnauthorized()}
    </View>

})

export default TabOrder

const styles = StyleSheet.create({
    section: {
        marginBottom: 14
    },
    sectionGroup: {
        //backgroundColor: '#F7F7F7',
        borderRadius: 9,
        borderWidth: 0,
        borderColor: '#BBBBBB',
    }
});

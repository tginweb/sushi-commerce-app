import React, {useCallback, useMemo, useState} from "react"
import {StyleSheet} from "react-native"
import {observer} from "mobx-react"
import {useStores} from "~stores"
import {useServices} from "~services"
import {OrderModel} from "@core/sale/model/Order";
import {ActionMobile, Order} from "~gql/api";
import {UiBtnProps} from "~ui/btn";
import {UiBottomSheet} from "~com/ui/bottom-sheet";
import {Text, View} from "react-native-ui-lib";
import {useCountdown} from "@core/main/lib/hooks/useCountdown";

export const OrderPayModal: React.FC = observer(() => {

    const {orderPayDialog, menu, debug} = useStores()
    const {catalogUtil} = useServices()

    const [action, setAction] = useState<ActionMobile>()
    const [loading, setLoading] = useState<boolean>(false)

    const order = orderPayDialog.props.order || new OrderModel({} as Order)

    const [count, {startCountdown, resetCountdown}] = useCountdown({
        countStart: 5,
        onComplete: () => {
            // onPay()
        }
    })

    const fetch = useCallback(async () => {
        setLoading(true)
        const res = await order.apiQueryPay({})

        if (res?.state?.success && res.payload?.actionMobile) {
            debug.warn('Fetch payment - success', {actionMobile: res.payload?.actionMobile})
            setAction(res.payload?.actionMobile)
            startCountdown()
        } else {
            debug.warn('Fetch payment - error', res)
        }

        setLoading(false)
    }, [orderPayDialog.props.savePaymentType])

    const onPay = useCallback(async () => {
        if (action) {
            menu.runActionItem(action)
            orderPayDialog.hide(true)
        }
    }, [action])

    const onShow = useCallback(() => {
        setAction(undefined)
        resetCountdown()
        fetch()
    }, [])

    const actions = useMemo(() => {
        const res: UiBtnProps[] = []
        res.push({
            label: 'Оплатить онлайн',
            onPress: onPay,
            disabled: !action,
            loading: loading
        })
        return res
    }, [action, loading])

    return <UiBottomSheet
        id={'order-pay'}
        isVisible={orderPayDialog.visible}
        title="Оплата заказа"
        onClose={() => orderPayDialog.hide(true)}
        autoHeight={true}
        preset={'default'}
        footerActions={actions}
        stackBehavior={'push'}
        onShow={onShow}
    >
        <View marginV-30 gap-20>

            <View centerH gap-10>
                <Text text-lg-m-lh0>Сумма к оплате:</Text>
                <Text text-xl-bo-lh0>{catalogUtil.formatPriceCurrency(order.PRICE_PAY)}</Text>
            </View>

            {action &&
                <View>
                    <Text text-md-lh2 center>
                        Вы будете перенаправлены на страницу оплаты заказа через
                        <Text text-md-bo-lh2> {count} секунд</Text>
                    </Text>
                </View>
            }

        </View>
    </UiBottomSheet>
})

export default OrderPayModal

const styles = StyleSheet.create({})

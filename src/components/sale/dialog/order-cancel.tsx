import React, {useCallback, useMemo, useState} from "react"
import {StyleSheet} from "react-native"
import {observer} from "mobx-react"
import {useStores} from "~stores"
import {COLORS} from "~assets/design";
import {OrderModel} from "@core/sale/model/Order";
import {Order} from "~gql/api";
import {UiBtnProps} from "~ui/btn";
import {UiBottomSheet} from "~com/ui/bottom-sheet";
import {RadioButton, RadioGroup, Text, View} from "react-native-ui-lib";
import {UiTextField} from "~ui/text-field";

export const OrderCancelModal: React.FC = observer(() => {

    const {orderCancelDialog, sale, router} = useStores()

    const [reason, setReason] = useState<string>()
    const [comment, setComment] = useState<string>()

    const order = orderCancelDialog.props.order || new OrderModel({} as Order)

    const onCancel = useCallback(async () => {
        const res = await order.apiMutateCancel({
            comment,
            reason
        })
        if (res && res.payload?.entity) {
            sale.mergeActiveOrder(res.payload?.entity)
            orderCancelDialog.hide(true)
            router.replace('/user')
        }
    }, [reason, comment])

    const actions = useMemo(() => {
        const res: UiBtnProps[] = []
        res.push({
            label: 'Отменить заказ',
            disabled: !reason,
            loading: order.apiMutateCancel.pending,
            onPress: onCancel
        })
        return res
    }, [onCancel, reason, order.apiMutateCancel.state])

    return <UiBottomSheet
        id={'order-cancel'}
        isVisible={orderCancelDialog.visible}
        title="Отмена заказа"
        onClose={() => orderCancelDialog.hide(true)}
        autoHeight={true}
        preset={'default'}
        footerActions={actions}
        stackBehavior={'push'}
    >
        <View marginV-30 gap-20>

            <View>
                <Text text-md-lh2>Укажите причину отмены заказа:</Text>
            </View>

            <RadioGroup
                initialValue={reason}
                onValueChange={(v: string) => setReason(v)}
                gap-20
            >
                {order.CANCEL_REASONS.map(item => <RadioButton
                    key={item.CODE}
                    value={item.CODE}
                    label={item.NAME}
                    color={COLORS.primary}
                />)}
            </RadioGroup>

            <UiTextField
                floatingPlaceholder
                placeholder={'Ваш комментарий'}
                presets={['outline']}
                value={comment}
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
                onChangeText={setComment}
            />

        </View>
    </UiBottomSheet>
})

export default OrderCancelModal

const styles = StyleSheet.create({})

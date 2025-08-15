import {Text, TouchableOpacity, View} from "react-native-ui-lib";
import {StyleSheet} from "react-native";
import React, {useCallback} from "react";
import {useStores} from "~stores";
import {observer} from "mobx-react";
import {UiCard, UiCardProps} from "~ui/card";
import {OrderModel} from "@core/sale/model/Order";
import {UiTimeView} from "~ui/time-view";
import {useServices} from "~services";

type TProps = UiCardProps & {}

export const UserActiveOrdersCard: React.FC<TProps> = observer((props) => {

    const {
        ...rest
    } = props

    const {
        sale,
        router,
    } = useStores()

    const {catalogUtil} = useServices()

    const renderUserBoxOrder = useCallback((order: OrderModel, index: number) => {
        return <TouchableOpacity
            key={order.ID}
            onPress={() => {
                router.push({
                    pathname: '/user/order',
                    params: {
                        orderId: order.ID
                    }
                })
            }}
            style={{
                borderBottomWidth: index < sale.userOrdersActive.length - 1 ? 1 : 0,
                borderBottomColor: '#DDDDDD',
            }}
            paddingV-12
            paddingH-14
        >
            <View gap-10>
                <View row centerV>
                    <Text text-sm-m-lh0 grey10>Заказ №{order.ID}</Text>
                    <View
                        bg-secondary
                        paddingH-4
                        paddingV-2
                        marginL-auto
                    >
                        <Text text-sm-m-lh0 white>{order.CSTATUS_NAME}</Text>
                    </View>
                </View>
                <View row centerV>
                    <Text text-xs-m-lh0>{catalogUtil.formatPriceCurrency(order.PRICE_PAY)}</Text>
                    <UiTimeView
                        prepend={<Text text-xxs-lh0>{order.transportTypeName}</Text>}
                        value={order.deliveryTimeDayJs}
                        marginL-auto
                        textModifiers={{
                            'text-xxs-lh0': true
                        }}
                    />
                </View>
            </View>
        </TouchableOpacity>
    }, [])


    const orders = sale.userOrdersActive.slice(0, 2)

    const haveMore = orders.length < sale.userOrdersActive.length

    if (!orders.length)
        return null

    return <UiCard
        title={sale.userOrdersActive.length > 1 ? 'Активные заказы' : 'Активный заказ'}
        titleProps={{
            center: !haveMore
        }}
        preset={'frontUser'}
        headerProps={{
            'paddingH-10': true
        }}
        headerMore={haveMore ? 'все заказы' : false}
        headerMoreUrl={'router://user/orders-active'}
        loading={sale.fetchClientCard.pending}
        paddingH-0
        contentProps={{
            style: {
                paddingHorizontal: 0,
            }
        }}
        containerProps={{
            style: {
                paddingBottom: 0,
            }
        }}
        {...rest}
    >
        {orders.map((order, index) => renderUserBoxOrder(order, index))}
    </UiCard>
})

const styles = StyleSheet.create({});




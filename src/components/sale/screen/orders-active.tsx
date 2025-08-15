import React from "react"
import {StyleSheet} from "react-native"
import {observer} from "mobx-react"
import {useFocusEffect} from "expo-router"
import {Text, TouchableOpacity, View} from "react-native-ui-lib"
import {useServices} from "~services"
import {useStores} from "~stores"
import {TScreenProps} from "@core/main/types"
import {UiScreen} from "~ui/screen"
import {useScreenFetch} from "@core/main/lib/hooks/useScreenFetch"
import {useNavigation} from '@react-navigation/native'
import {UiTimeView} from "~ui/time-view";
import icons from "~assets/icons-map";

export const OrdersHistoryScreen: React.FC<TScreenProps> = observer((p) => {

    const {sale, router} = useStores()
    const {catalogUtil} = useServices()
    const nav = useNavigation()

    useFocusEffect(
        () => {
            nav.setOptions({
                hideBottomInformer: true,
                headerRightActions: [
                    {
                        icon: icons.refresh,
                        link: true,
                        iconSize: 20,
                        onPress: () => {
                            sale.fetchOrdersActive({})
                        }
                    }
                ],
            })
        }
    )

    useScreenFetch(sale.fetchOrdersActive, {
        refetchImmediate: sale.userOrdersActive.length === 0 || sale.fetchOrdersActive.initial,
        refetchParam: true,
        refetchParamDelete: true,
    })

    return (
        <UiScreen
            loading={sale.fetchOrdersActive.pending}
            loadingShowContent={true}
            preset={'profile'}
        >
            {!!sale.userOrdersActive.length &&
                <View gap-10>
                    {sale.userOrdersActive.map(order =>
                        <TouchableOpacity
                            key={order.ID}
                            onPress={() => {
                                router.push({
                                    pathname: '/user/order',
                                    params: {
                                        orderId: order.ID
                                    }
                                })
                            }}
                        >
                            <View bg-white br-sm gap-10 paddingV-14 paddingH-14>
                                <View row centerV>
                                    <Text text-md-m-lh0 grey10>Заказ №{order.ID}</Text>
                                    <Text
                                        text-md-m-lh0
                                        style={{
                                            color: order.CSTATUS_COLOR,
                                            marginLeft: 'auto'
                                        }}
                                    >{order.CSTATUS_NAME}</Text>
                                </View>
                                <View row centerV>
                                    <Text>{catalogUtil.formatPriceCurrency(order.PRICE_PAY)}</Text>
                                    <UiTimeView
                                        prepend={<Text text-sm-lh0>{order.transportTypeName}</Text>}
                                        value={order.deliveryTimeDayJs}
                                        marginL-auto
                                        textModifiers={{
                                            'text-sm-lh0': true
                                        }}
                                    />
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                </View>
            }
            {!sale.userOrdersActive.length && sale.fetchOrdersActive.resolvedOnce &&
                <View flex centerV centerH>
                    <Text>У вас нет активных заказов</Text>
                </View>
            }
        </UiScreen>
    )
});


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

export default OrdersHistoryScreen

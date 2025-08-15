import React, {useCallback, useEffect} from "react"
import {StyleSheet} from "react-native"
import {observer} from "mobx-react"
import {useFocusEffect, useNavigation} from "expo-router"
import {Text, View} from "react-native-ui-lib"
import {useStores} from "~stores"
import {TScreenProps} from "@core/main/types"
import {UiScreen} from "~ui/screen"
import {OrderViewHistory} from "~com/sale/order/order-view-history"
import icons from "~assets/icons-map";
import {useMounted} from "@core/main/lib/hooks/useMounted";

export const OrdersHistoryScreen: React.FC<TScreenProps> = observer((p) => {

    const {sale} = useStores()

    const nav = useNavigation()
    const mounted = useMounted()

    const setNavOptions = () => {
        nav.setOptions({
            headerRightActions: [{
                icon: icons.refresh,
                link: true,
                iconSize: 20,
                loading: sale.fetchOrdersHistory.pending,
                onPress: () => sale.fetchOrdersHistory({cache: false})
            }]
        })
    }

    useFocusEffect(useCallback(() => {
        if (!sale.userOrdersHistory.length)
            sale.fetchOrdersHistory({})
        setNavOptions()
    }, []))

    useEffect(() => {
        
        setNavOptions()
    }, [sale.fetchOrdersHistory.pending]);

    return (
        <UiScreen
            bodyValign={'top'}
            preset={'profile'}
            loading={!mounted || sale.fetchOrdersHistory.pending}
        >
            {!!sale.userOrdersHistory.length ?
                <View style={{gap: 20}}>
                    {sale.fetchOrdersHistory.match({
                        rejected: (err: any) => <Text>Error: {err.message}</Text>,
                        resolved: () => sale.userOrdersHistory.map(
                            (order) => <OrderViewHistory key={order.ID} order={order}/>
                        )
                    })}
                </View>
                :
                <View>
                    <Text center>История заказов пуста</Text>
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

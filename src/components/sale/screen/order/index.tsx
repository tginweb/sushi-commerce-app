import React, {useCallback, useEffect, useRef} from "react"
import {StyleSheet, View as NativeView} from "react-native"
import {observer} from "mobx-react"
import {Text, View} from "react-native-ui-lib"
import {useStores} from "~stores"
import {UiBottomSheet, UiBottomSheetMethods, useBottomSheetScope} from "~com//ui/bottom-sheet";
import {COLORS, TYPOGRAPHY, wHeight} from "~assets/design"

import {useFocusEffect, useLocalSearchParams} from "expo-router"
import {MapYandex, MapYandexApi} from "~com/geo/map-yandex"
import {TScreenProps} from "@core/main/types"
import {UiSection} from "~ui/section"
import {UiList} from "~ui/list"
import {BasketItemOrder} from "~com/sale/order/inc/basket-item-order"
import {UiActions} from "~ui/actions"
import {OrderStatuses} from "./components/statuses"
import {useActions, useMap, useMethods, useOrderFields, useOrderStatus} from "./index.hooks"
import {useLayout} from "@core/main/lib/hooks/useLayout";
import {TComponentRefs} from "~com/sale/screen/order/index.types";
import {useNavigation} from "@react-navigation/native";
import {useScreenFetch} from "@core/main/lib/hooks/useScreenFetch";
import {useHeaderHeight} from "@react-navigation/elements";
import {UiBtn} from "~ui/btn";
import {OrderModel} from "@core/sale/model/Order";
import {UiScreenError} from "~ui/screen-error";

const OrderScreenInner: React.FC<{ order: OrderModel }> = observer(({order}) => {

    const routeParams: any = useLocalSearchParams()
    const nav = useNavigation()
    const {sale, router, push, debug} = useStores()
    const headerHeight = useHeaderHeight()

    useEffect(() => {
        if (sale.fetchOrdersActive.pending) {
            nav.setOptions({
                headerRightActions: [{
                    label: 'обновить',
                    loading: true,
                    onPress: () => sale.fetchOrdersActive({})
                }]
            })
        } else {
            nav.setOptions({
                headerRightActions: [{
                    label: 'обновить',
                    loading: false,
                    onPress: () => sale.fetchOrdersActive({})
                }]
            })
        }
        return () => {
            nav.setOptions({
                headerRightActions: []
            })
        }
    }, [sale.fetchOrdersActive.pending])

    useFocusEffect(useCallback(() => {

        debug.info('Order view screen: useFocusEffect')

        push.register(true, true)

        nav.setOptions({
            hideBottomInformer: true,
        })

        if (routeParams.context === 'order-make') {
            methods.onOrderPay()
        }

        return () => {
            //modal.hide()
        }
    }, []))

    useScreenFetch(sale.fetchOrdersActive, {
        refetchImmediate: sale.userOrdersActive.length === 0 || sale.fetchOrdersActive.initial,
        refetchParam: true,
    })

    const refs: TComponentRefs = {
        layout: React.useRef<NativeView>(null as any),
        map: useRef<MapYandexApi>(null as any),
        modal: useRef<UiBottomSheetMethods>(null as any),
    }

    // COMPUTED

    const methods = useMethods(order, refs)
    const status = useOrderStatus(order)
    const fields = useOrderFields(order, methods)
    const layout = useLayout(refs.layout, {testId: 'screen.order.layout'})

    const minSheetHeight = 220

    const modal = useBottomSheetScope({
        snapPoints: [
            minSheetHeight,
            '50%',
            '90%',
        ],
        initialSnapIndex: 1,
        toggleOnFocusEffect: true,
        layout: layout
    })

    const map = useMap(order, modal)

    const actions = useActions(order, methods)

    const fieldItemProps = {
        textPreset: 'text-md-r-lh0',
        contentTextPreset: 'text-md-r-lh0'
    }

    const mapHeight = wHeight - minSheetHeight - headerHeight

    const renderStatus = () =>
        <View row centerV gap-6>
            <Text bold text-md-lh0 style={{color: order.CSTATUS_COLOR}}>{order.CSTATUS_NAME}</Text>
        </View>

    return (
        <View
            style={styles.container}
            ref={refs.layout}
            onLayout={layout.onLayout}
        >
            {modal.visible && <MapYandex
                ref={refs.map}
                height={mapHeight}
                coords={map.centerCoords}
                zoom={17}
                markers={map.markers}
                selectedMarkerId={'place'}
                markersSelectable={true}
                driver={map.driver}
                offsetY={(modal.backstageHeight - mapHeight) / 2}
            />}

            <UiBottomSheet
                id={'order'}
                isVisible={modal.visible}
                title={'Заказ № ' + order.ACCOUNT_NUMBER + ' на ' + order.PRICE_PAY + ' ₽'}
                backdrop={false}
                autoHeight={false}
                snapPoints={modal.snapPoints}
                snapIndex={modal.snapIndex}
                onSnapIndexChange={modal.setSnapIndex}
                topInset={0}
                ref={refs.modal}
                enablePanDownToClose={false}
                preset={'default'}
                targetModifiers={{
                    scroll: ['paddingH-12'],
                }}
                targetStyles={{
                    topbarTitle: {
                        ...TYPOGRAPHY['text-md-m-lh0'],
                    }
                }}
                closeOnRouterBack={false}
                onClose={(fromDismiss) => {
                    modal.hide()
                    if (!fromDismiss) router.push('/user')
                }}
            >
                <View marginT-16 marginB-40 style={{gap: 16}}>

                    <UiActions
                        containerStyle={{
                            flexDirection: 'row',
                            gap: 30
                        }}
                        items={actions.buttons}
                    />

                    {
                        order.isCourierStateVisible && <UiSection
                            style={styles.courierArrivalSection}
                            onPress={methods.onMapNavDriver}
                        >
                            <Text font-size-md center white>
                                {order.COURIER_STATE?.ARRIVAL_TIME_CAPTION}
                                <Text bold white> {order.COURIER_STATE?.ARRIVAL_TIME}</Text>
                            </Text>
                        </UiSection>
                    }

                    <UiSection
                        headerTitle={'Текущий статус'}
                        headerTitleStyle={{
                            fontWeight: '500'
                        }}
                        headerSideSlot={renderStatus()}
                        preset={['filled']}
                        headerOnPress={() => status.setStepsExpanded(!status.stepsExpanded)}
                        headerOnLongPress={() => {

                        }}
                    >
                        {status.stepsExpanded && !!status.statuses.length && <OrderStatuses
                            order={order}
                            statuses={status.statuses}
                            currentStatusIndex={status.currentStatusIndex}
                        />}
                    </UiSection>

                    <UiSection
                        headerTitle={order.isTransportTypeCourier ? 'Доставка' : 'Самовывоз'}
                        preset={['filled']}
                    >
                        <UiList
                            items={fields.delivery}
                            itemPreset={['fields']}
                            itemProps={fieldItemProps}
                        />
                    </UiSection>

                    <UiSection
                        headerTitle={'Оплата'}
                        preset={['filled']}
                    >
                        <UiList
                            items={fields.payment}
                            itemPreset={['fields']}
                            itemProps={fieldItemProps}
                        />

                        {order.IS_CAN_PAY_ONLINE && <UiBtn
                            label={order.PAYSYSTEM_IS_ONLINE ? 'Оплатить онлайн' : 'Изменить на оплату онлайн'}
                            color={COLORS.primary}
                            size={'small'}
                            backgroundColor={COLORS.white}
                            onPress={methods.onOrderPay}
                        />}

                    </UiSection>

                    <UiSection
                        headerTitle={'Корзина'}
                        preset={['filled']}
                    >
                        <View gap-8 marginT-8>
                            {order.BASKET.map((item) =>
                                <BasketItemOrder
                                    key={item.ID}
                                    basketItem={item}
                                />
                            )}
                        </View>
                    </UiSection>

                    <UiSection
                        headerTitle={'Свойства заказа'}
                        preset={['filled']}
                    >
                        <UiList
                            items={fields.other}
                            itemPreset={['fields']}
                            itemProps={fieldItemProps}
                        />
                    </UiSection>

                </View>

            </UiBottomSheet>

        </View>
    )
})

export const OrderScreen: React.FC<TScreenProps> = observer(({}) => {
    const routeParams: any = useLocalSearchParams()
    const {sale} = useStores()
    const order = sale.userOrdersActive.find(order => order.ID === parseInt(routeParams.orderId))
    return order ? <OrderScreenInner order={order}/> : <UiScreenError title={'Заказ не найден или завершен'}/>
})

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollViewContentContainer: {
        paddingHorizontal: 16,
        paddingTop: 16
    },
    courierArrivalSection: {
        backgroundColor: 'rgba(11,107,11,0.8)'
    }
})

export default OrderScreen

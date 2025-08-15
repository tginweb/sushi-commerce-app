import React, {useMemo, useState} from "react";
import {OrderModel} from "@core/sale/model/Order";
import {TComponentRefs, TOrderStatusExtended} from "~com/sale/screen/order/index.types";
import {useStores} from "~stores";
import {UiListItemProps} from "~ui/list-item";
import filterFields from "@core/main/util/base/filterFields";
import {COLORS} from "~assets/design";
import {TBottomSheetScope} from "~com//ui/bottom-sheet";

import {UiBtnProps} from "~ui/btn";
import {icons} from "~assets/icons-map"
import {TGeoCoordsData} from "@core/geo/types";
import {GeoMarker} from "@core/geo/class/GeoMarker";
import {GeoConfig} from "@core/geo/config"
import {Alert} from "react-native";
import {UiPrice} from "~ui/price";
import {GeoMarkerHome} from "@core/geo/class/GeoMarkerHome";

export function useOrderStatus(order: OrderModel) {

    const {sale, app} = useStores()

    const [stepsExpanded, setStepsExpanded] = useState<boolean>(false)

    const statuses: TOrderStatusExtended[] = useMemo(() => {

        let foundCurrent = false

        const res = sale.orderStatusesComputed.map((status) => {

            const extend: TOrderStatusExtended = {} as TOrderStatusExtended

            const orderStatusId = order.CSTATUS_ID

            if (status.ID === orderStatusId) {
                foundCurrent = true
                extend.CURRENT = true
            }

            if (!foundCurrent) {
                extend.DONE = true
            }

            if (extend.DONE || extend.CURRENT) {
                extend.COLOR_STROKE = '#00AA00';
                extend.READY = true
            } else {
                extend.COLOR_STROKE = '#AAAAAA';
                extend.READY = false
            }

            extend.COLOR_FILL = '#FFF';

            if (status.ID === 'D') {
                if (!order.isTransportTypeCourier) {
                    extend.NAME = 'Самовывоз'
                    extend.ICON = 'pickup'
                }
            }

            return {
                ...status,
                ...extend
            } as TOrderStatusExtended
        }).filter((status) => {

            if (status.ID === 'F' && !status.DONE) {
                return false
            }

            if (status.ID === 'N' && status.DONE) {
                return false
            }
            return true
        })

        if (res.length) {
            res[0].FIRST = true
            res[res.length - 1].LAST = true
        }

        return res
    }, [order])

    const currentStatus = statuses.find(status => status.CURRENT)
    const currentStatusIndex = statuses.findIndex(status => status.CURRENT)

    return {
        statuses,
        currentStatus,
        currentStatusIndex,
        stepsExpanded,
        setStepsExpanded
    }
}


export function useOrderFields(order: OrderModel, methods: ReturnType<typeof useMethods>) {

    const {company} = useStores()

    const payment = useMemo(() => {

        const res: UiListItemProps[] = []

        res.push({
            label: 'Способ оплаты',
            content: order.attr.PAYMENT_TYPE?.VALUE_VIEW || ''
        })

        if (order.attrValue.DISCOUNT_PERCENT) {
            if (order.attrValue.DISCOUNT_PERCENT) {
                res.push({
                    label: order.attrValue.DISCOUNT_REASON,
                    content: order.attrValue.DISCOUNT_PERCENT + '%'
                })
            }
        } else if (order.BONUSES) {
            res.push({
                label: 'Использовать бонусы',
                content: order.BONUSES
            })
        } else if (order.COUPONS.length) {
            res.push({
                label: 'Использовать промокод',
                content: order.COUPONS.map(item => item.COUPON).join(', '),
                contentTextPreset: ['bold', 'green20']
            })
        }

        if (order.PRICE_PAY !== order.PRICE_BASKET) {
            res.push({
                label: 'Стоимость товаров',
                content: !!order.PRICE_BASKET &&
                    <UiPrice centerV gap-5 price={order.PRICE_BASKET} priceBase={order.PRICE_BASKET_BASE}/>
            })
        }

        res.push({
            label: 'Стоимость доставки',
            content: !!order.PRICE_DELIVERY &&
                <UiPrice centerV gap-5 price={order.PRICE_DELIVERY} priceBase={order.PRICE_DELIVERY_BASE}/>
        })

        res.push({
            label: 'К оплате',
            content: <UiPrice centerV gap-5 price={order.PRICE_PAY}
                              priceBase={!order.PRICE_DELIVERY ? order.PRICE_PAY_BASE : 0}/>,
        })

        if (order.PAYSYSTEM_IS_ONLINE) {
            if (order.IS_PAID) {
                res.push({label: 'Оплачен', content: 'оплачен', contentTextPreset: ['green10', 'bold']})
            } else {
                res.push({label: 'Оплачен', content: 'не оплачен', contentTextPreset: ['red10', 'bold']})
            }
        }

        return filterFields(res)

    }, [order])

    const delivery = useMemo(() => {

        const res: UiListItemProps[] = []

        if (order.isTransportTypeCourier) {

            //res.push({label: 'Способ доставки', value: 'курьером'})

            res.push({
                label: 'Адрес',
                content: order.getAddress(true),
                onPress: () => methods.onMapNavAddress(),
                showMore: false,
            })

            res.push({label: 'Время', content: order.deliveryTimeView})
        } else {
            res.push({
                label: 'Адрес',
                showMore: false,
                content: order.PICKUP_DEPARTMENT?.NAME,
                onPress: () => methods.onMapNavAddress(),
                /*
                onPress: () => {
                    const office = company.offices.find(item => item.ID === order.PICKUP_DEPARTMENT?.ID)

                    if (office)
                        company.showOfficeModal(office, {showMap: false})
                }

                 */
            })
            res.push({label: 'Время', content: order.deliveryTimeView})
        }

        return filterFields(res)

    }, [order])

    const other = useMemo(() => {

        const res: UiListItemProps[] = []

        if (order.haveDetails) {
            res.push({label: 'Количество приборов', content: order.attr.PERSONS_NUMBER?.VALUE_VIEW})
            res.push({
                label: 'Перезвонить для подтверждения',
                content: order.attr.WITH_OPERATOR?.VALUE_VIEW
            })
        }

        res.push({
            label: 'Номер телефона',
            content: order.attr.PHONE?.VALUE_VIEW
        })

        res.push({
            label: 'Комментарий к заказу',
            content: order.USER_DESCRIPTION,
            contentWrap: true
        })

        return filterFields(res)
    }, [order])

    return {
        delivery,
        payment,
        other
    }
}

export function useMethods(order: OrderModel, refs: TComponentRefs) {

    const {sale, router, orderPayDialog, app} = useStores()

    const fetch = async () => {
        await sale.fetchOrdersActive({})
    }

    const onMapNavAddress = () => {
        refs.map.current?.command({
            name: 'moveToMarker'
        })
    }

    const onMapNavDriver = () => {
        refs.map.current?.command({
            name: 'moveToDriver'
        })
    }

    const onOrderCancel = async () => {
        if (await order.apiMutateCancel({})) {
            router.push('/user')
            await fetch()
        }
    }

    const onOrderPay = async (savePaymentType = false) => {
        if (!order.PAYSYSTEM_IS_ONLINE) {
            Alert.alert('Подтверждение', 'Изменить тип оплаты на онлайн оплату картой?', [
                {
                    text: "Ok",
                    onPress: () => {
                        orderPayDialog.show({order})
                    },
                    style: 'default'
                },
                {
                    text: "Отмена",
                    style: 'cancel'
                },
            ])
        } else {
            orderPayDialog.show({order})
        }
    }

    return {
        fetch,
        onMapNavAddress,
        onMapNavDriver,
        onOrderCancel,
        onOrderPay,
    }
}

export function useActions(
    order: OrderModel,
    methods: ReturnType<typeof useMethods>
) {

    const {contactsDialog, orderCancelDialog} = useStores()

    const buttons = useMemo<UiBtnProps[]>(() => {

        const actions: UiBtnProps[] = [
            {
                labelBottom: 'Оплатить',
                icon: icons.payment_card,
                onPress: methods.onOrderPay,
                hidden: !order.PAYSYSTEM_IS_ONLINE
            },
            {
                labelBottom: 'Связь',
                icon: icons.phone,
                onPress: () => contactsDialog.show()
            },
            {
                labelBottom: 'Адрес',
                icon: icons.home,
                onPress: methods.onMapNavAddress
            },
            {
                labelBottom: 'Отмена',
                icon: icons.cancel,
                onPress: () => orderCancelDialog.show({order}),
                outlineColor: COLORS.danger,
                hidden: !order.IS_CAN_CANCEL
            },
        ]

        return actions.map(action => ({
            iconSize: 18,
            size: 'large',
            outlineColor: COLORS.primaryLight,
            enableShadow: true,
            avoidMinWidth: true,
            labelStyle: {},
            outline: true,
            containerStyle: {
                flex: 1,
            },
            buttonStyle: {
                padding: 10
            },
            ...action
        }))
    }, [order])

    return {
        buttons,
    }
}

export function useMap(
    order: OrderModel,
    modal: TBottomSheetScope,
) {

    const markers = useMemo(() => {

        const res: GeoMarker[] = []

        if (order.isTransportTypeCourier) {

            if (order.houseCoordsObject) {
                res.push(new GeoMarkerHome(
                    'place',
                    order.houseCoordsObject,
                    {},
                    {},
                    {
                        iconContent: order.getAddress(true, false)
                    },
                ))
            }
        } else {
            const office = order.PICKUP_DEPARTMENT
            if (office && office.coordinatesObject) {
                res.push(new GeoMarker(
                    'place',
                    office.coordinatesObject,
                    {
                        iconContent: office.NAME,
                    },
                    {
                        preset: 'islands#darkOrangeStretchyIcon',
                    }, {
                        iconContent: order.PICKUP_DEPARTMENT?.NAME
                    }
                ))
            }
        }

        return res
    }, [order])

    const marker = markers[0]

    const driver = useMemo<GeoMarker | null | undefined>(() => {
        return order.COURIER_STATE?.marker
    }, [order])

    const centerCoords = useMemo<TGeoCoordsData>(() => {
        return markers.length ? markers[0].coords.getArray() : GeoConfig.GEO_DEFAULT_CENTER_COORDS
    }, [marker?.coords?.getString()])

    return {
        marker,
        markers,
        driver,
        height: modal.backstageHeight,
        centerCoords
    }
}



import {TIconRender} from "@core/main/types";
import iconWrapper from "@core/main/util/react/iconWrapper";

import HomeIcon from "./icons/Home"
import CartIcon from "./icons/Cart"
import DeleteIcon from "./icons/Delete"
import MapIcon from "./icons/Map"
import CakeCandlesIcon from "./icons/CakeCandles"
import ProductIcon from "./icons/Product"
import CircleQuestionIcon from "./icons/CircleQuestion"
import ProfileIcon from "./icons/Profile"
import SearchIcon from "./icons/Search"
import CancelIcon from "./icons/Cancel"
import DiscountIcon from "./icons/Discount"
import LocationIcon from "./icons/Location"
import HistoryIcon from "./icons/History"
import LogoutIcon from "./icons/Logout"
import BuyIcon from "./icons/Buy"
import MoreIcon from "./icons/More"
import LogoIcon from "./icons/Logo"
import LogoMapIcon from "./icons/LogoMap"
import LogoMiniIcon from "./icons/LogoMini"
import StarIcon from "./icons/Star"
import FiltersIcon from "./icons/Filters"
import BellIcon from "./icons/Bell"

import BaloonIcon from "./icons/Baloon"
import PhoneIcon from "./icons/Phone"
import ClockIcon from "./icons/Clock"
import GridIcon from "./icons/Grid"
import ListIcon from "./icons/List"
import EditIcon from "./icons/Edit"
import NavIcon from "./icons/Nav"
import DeliveryCourierIcon from "./icons/DeliveryCourier"
import DeliveryPickupIcon from "./icons/DeliveryPickup"
import BonusIcon from "./icons/Bonus"
import PaymentCashIcon from "./icons/PaymentCash"
import PaymentTerminalIcon from "./icons/PaymentTerminal"
import PaymentCardIcon from "./icons/PaymentCard"
import GiftIcon from "./icons/Gift"
import CutleryIcon from "./icons/Cutlery"
import PlusIcon from "./icons/Plus"
import MinusIcon from "./icons/Minus"
import AngleRight from "./icons/AngleRight"
import AngleDownIcon from "./icons/AngleDown"
import AngleLeftIcon from "./icons/AngleLeft"
import EmptyListIcon from "./icons/EmptyList"
import XMarkIcon from "./icons/Xmark"
import ActiveOrderIcon from "./icons/ActiveOrder"
import LocationsInfoIcon from "./icons/LocationsInfo"
import FaqIcon from "./icons/Faq"
import FeedbackIcon from "./icons/Feedback"
import InfoFaqIcon from "./icons/InfoFaq"
import HeartIcon from "./icons/Heart"
import HeartSolidIcon from "./icons/HeartSolid"
import InfoIcon from "./icons/Info"
import ErrorIcon from "./icons/Error"
import CheckIcon from "./icons/Check"
import ChevronLeftIcon from "./icons/ChevronLeft"
import BarsIcon from "./icons/Bars"
import InfoCircleIcon from "./icons/InfoCircle"
import CommentDotsIcon from "./icons/CommentDots"
import RefreshIcon from "./icons/Refresh"
import MobileIcon from "./icons/Mobile"
import ExpandIcon from "./icons/Expand"
import ChevronUpIcon from "./icons/ChevronUp"
import GeoTargetIcon from "./icons/GeoTarget"
import TelegramIcon from "./icons/Telegram"

import {TouchableOpacity, View, ViewProps} from "react-native-ui-lib";
import React from "react";
import {ActivityIndicator, StyleProp, ViewStyle} from "react-native"
import {COLORS, roundStyle} from "~assets/design";

type TIconsMap = Record<TIconNames, (TIconRender)>

export type TIconNames = 'home' |
    'cakeCandles' |
    'cart' |
    'del' |
    'cancel' |
    'map' |
    'product' |
    'profile' |
    'search' |
    'discount' |
    'location' |
    'history' |
    'logout' |
    'buy' |
    'more' |
    'logo' |
    'logoMap' |
    'logoMini' |
    'baloon' |
    'clock' |
    'phone' |
    'grid' |
    'list' |
    'deliveryCourier' |
    'deliveryPickup' |
    'bonus' |
    'edit' |
    'nav' |
    'payment_cash' |
    'payment_terminal' |
    'payment_card' |
    'gift' |
    'cutlery' |
    'plus' |
    'minus' |
    'orderStatusA' |
    'orderStatusN' |
    'orderStatusP' |
    'orderStatusO' |
    'orderStatusT' |
    'orderStatusK' |
    'orderStatusD' |
    'mapPointer' |
    'angleRight' |
    'angleLeft' |
    'angleDown' |
    'emptyList' |
    'xmark' |
    'activeOrder' |
    'locationsInfo' |
    'faq' |
    'feedback' |
    'infoFaq' |
    'heart' |
    'heartSolid' |
    'check' |
    'error' |
    'info' |
    'chevronLeft' |
    'bars' |
    'infoCircle' |
    'star' |
    'commentDots' |
    'refresh' |
    'mobile' |
    'expand' |
    'chevronUp' |
    'filters' |
    'geoTarget' |
    'bell' |
    'circleQuestion' |
    'telegram'

export const icons: TIconsMap = {

    telegram: iconWrapper(TelegramIcon, ({color}) => ({fill: color})),
    circleQuestion: iconWrapper(CircleQuestionIcon, ({color}) => ({fill: color})),
    cakeCandles: iconWrapper(CakeCandlesIcon, ({color}) => ({fill: color})),
    bell: iconWrapper(BellIcon, ({color}) => ({fill: color})),
    geoTarget: iconWrapper(GeoTargetIcon, ({color}) => ({fill: color})),
    chevronUp: iconWrapper(ChevronUpIcon, ({color}) => ({fill: color})),
    filters: iconWrapper(FiltersIcon, ({color}) => ({fill: color})),
    mobile: iconWrapper(MobileIcon, ({color}) => ({fill: color})),
    infoCircle: iconWrapper(InfoCircleIcon, ({color}) => ({fill: color})),

    bars: iconWrapper(BarsIcon, ({color}) => ({fill: color})),
    home: iconWrapper(HomeIcon, ({color}) => ({fill: color})),
    search: iconWrapper(SearchIcon, ({color}) => ({fill: color})),
    cart: iconWrapper(CartIcon, ({color}) => ({stroke: color})),
    buy: iconWrapper(BuyIcon, ({color}) => ({fill: color})),
    del: iconWrapper(DeleteIcon, ({color}) => ({fill: color})),
    cancel: iconWrapper(CancelIcon, ({color}) => ({fill: color})),
    map: iconWrapper(MapIcon, ({color}) => ({fill: color})),
    product: iconWrapper(ProductIcon, ({color}) => ({fill: color})),
    profile: iconWrapper(ProfileIcon, ({color}) => ({fill: color})),
    discount: iconWrapper(DiscountIcon, ({color}) => ({fill: color})),
    location: iconWrapper(LocationIcon, ({color}) => ({fill: color})),
    history: iconWrapper(HistoryIcon, ({color}) => ({fill: color})),
    logout: iconWrapper(LogoutIcon, ({color}) => ({fill: color})),
    more: iconWrapper(MoreIcon, ({color}) => ({fill: color})),

    logo: iconWrapper(LogoIcon, ({color}) => ({fill: color})),
    logoMap: iconWrapper(LogoMapIcon, ({color}) => ({stroke: color})),
    logoMini: iconWrapper(LogoMiniIcon, ({color}) => ({fill: color})),
    baloon: iconWrapper(BaloonIcon, ({color}) => ({fill: color})),

    clock: iconWrapper(ClockIcon, ({color}) => ({fill: color})),
    phone: iconWrapper(PhoneIcon, ({color}) => ({fill: color})),

    grid: iconWrapper(GridIcon, ({color}) => ({fill: color})),
    list: iconWrapper(ListIcon, ({color}) => ({fill: color})),

    deliveryCourier: iconWrapper(DeliveryCourierIcon, ({color}) => ({fill: color})),
    deliveryPickup: iconWrapper(DeliveryPickupIcon, ({color}) => ({fill: color})),
    bonus: iconWrapper(BonusIcon, ({color}) => ({fill: color})),

    edit: iconWrapper(EditIcon, ({color}) => ({fill: color})),

    nav: iconWrapper(NavIcon, ({color}) => ({fill: color})),

    payment_cash: iconWrapper(PaymentCashIcon, ({color}) => ({fill: color})),
    payment_card: iconWrapper(PaymentCardIcon, ({color}) => ({fill: color})),
    payment_terminal: iconWrapper(PaymentTerminalIcon, ({color}) => ({fill: color})),

    gift: iconWrapper(GiftIcon, ({color}) => ({fill: color})),
    cutlery: iconWrapper(CutleryIcon, ({color}) => ({fill: color})),

    plus: iconWrapper(PlusIcon, ({color}) => ({fill: color})),
    minus: iconWrapper(MinusIcon, ({color}) => ({fill: color})),

    angleRight: iconWrapper(AngleRight, ({color}) => ({fill: color})),
    angleLeft: iconWrapper(AngleLeftIcon, ({color}) => ({fill: color})),
    angleDown: iconWrapper(AngleDownIcon, ({color}) => ({fill: color})),

    orderStatusA: iconWrapper(PlusIcon, ({color}) => ({fill: color})),
    orderStatusN: iconWrapper(PlusIcon, ({color}) => ({fill: color})),
    orderStatusP: iconWrapper(PlusIcon, ({color}) => ({fill: color})),
    orderStatusO: iconWrapper(PlusIcon, ({color}) => ({fill: color})),
    orderStatusT: iconWrapper(PlusIcon, ({color}) => ({fill: color})),
    orderStatusK: iconWrapper(PlusIcon, ({color}) => ({fill: color})),
    orderStatusD: iconWrapper(PlusIcon, ({color}) => ({fill: color})),

    emptyList: iconWrapper(EmptyListIcon, ({color}) => ({fill: color})),
    xmark: iconWrapper(XMarkIcon, ({color}) => ({fill: color})),

    activeOrder: iconWrapper(ActiveOrderIcon, ({color}) => ({fill: color})),
    locationsInfo: iconWrapper(LocationsInfoIcon, ({color}) => ({fill: color})),

    faq: iconWrapper(FaqIcon, ({color}) => ({fill: color})),
    feedback: iconWrapper(FeedbackIcon, ({color}) => ({fill: color})),
    infoFaq: iconWrapper(InfoFaqIcon, ({color}) => ({stroke: color})),
    heart: iconWrapper(HeartIcon, ({color}) => ({fill: color})),
    heartSolid: iconWrapper(HeartSolidIcon, ({color}) => ({fill: color})),

    check: iconWrapper(CheckIcon, ({color}) => ({fill: color})),
    error: iconWrapper(ErrorIcon, ({color}) => ({fill: color})),
    info: iconWrapper(InfoIcon, ({color}) => ({fill: color})),
    chevronLeft: iconWrapper(ChevronLeftIcon, ({color}) => ({fill: color})),
    star: iconWrapper(StarIcon, ({color}) => ({fill: color})),
    commentDots: iconWrapper(CommentDotsIcon, ({color}) => ({fill: color})),
    refresh: iconWrapper(RefreshIcon, ({color}) => ({fill: color})),
    expand: iconWrapper(ExpandIcon, ({color}) => ({fill: color})),

    mapPointer: (
        {
            size = 50,
            loading,
            color = COLORS.primary
        }
    ) => {

        size = (typeof size === 'string' ? parseInt(size) : size)

        const logoSize = size - 30

        return <View>
            {icons.baloon({size, color})}
            <View style={{
                position: 'absolute',
                top: 10,
                left: 0,
                right: 0,
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                {
                    loading ?
                        <ActivityIndicator color={'#ffffff'} size={logoSize}/>
                        :
                        icons.logoMap({
                            size: size - 30,
                            color: '#ffffff'
                        })
                }
            </View>
        </View>
    }
}


export const IconBackRender = (color?: string, size = 20) => <AngleLeftIcon fill={color} width={size} height={size}/>

export default icons


export const CLOSER_BACK = (
    {
        size = 20,
        color = '#000000',
        onPress,
        style,
        backgroundColor = '#FFFFFF',
        ...rest
    }: ViewProps & {
        style?: StyleProp<ViewStyle>,
        size?: number,
        color?: string,
        onPress?: () => void
    }
) => {
    return <TouchableOpacity
        style={[
            {
                zIndex: 10,
                shadowColor: color,
                shadowOffset: {
                    width: 1,
                    height: 2,
                },
                shadowOpacity: 0.4,
                shadowRadius: 3,
                backgroundColor: backgroundColor,
                elevation: 6
            },
            roundStyle(size),
            style
        ]}
        onPress={onPress}
        centerH
        centerV
        {...rest}
    >
        {IconBackRender(color, size - 16 * size / 100)}
    </TouchableOpacity>
}

export const CLOSER_CLOSE = (
    {
        size = 20,
        color = '#000000',
        onPress,
        style,
        ...rest
    }: ViewProps & {
        style?: ViewStyle,
        size?: number,
        color?: string,
        onPress?: () => void
    }
) => {
    return <TouchableOpacity
        style={[
            {
                zIndex: 10,
                shadowColor: color,
                shadowOffset: {
                    width: 1,
                    height: 2,
                },
                shadowOpacity: 0.4,
                shadowRadius: 3,
                borderRadius: 20,
                padding: 3,
                backgroundColor: '#FFFFFF',
            },
            style
        ]}
        onPress={onPress}
        {...rest}
    >
        <CancelIcon
            fill={color}
            width={size}
            height={size}
        />
    </TouchableOpacity>
}

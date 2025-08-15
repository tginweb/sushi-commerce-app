import {gql} from "@apollo/client"

import BasketItem from "./BasketItem"
import OrderAttr from "~gql/fragments/OrderAttr"
import CourierState from "~gql/fragments/CourierState"
import DeliveryService from "~gql/fragments/DeliveryService"
import Coupon from "~gql/fragments/Coupon"

export default gql`
    fragment Order on Order {
        ID
        ACCOUNT_NUMBER
        URL
        DATE_INSERT

        USER_ID

        STATUS_ID
        STATUS_NAME
        STATUS_COLOR

        CSTATUS_ID
        CSTATUS_NAME
        CSTATUS_COLOR

        IS_PAID
        IS_ACTIVE
        IS_CANCELED
        IS_FINISHED
        IS_CAN_PAY
        IS_CAN_PAY_ONLINE
        IS_CAN_PAY_BILL
        IS_CAN_CANCEL
        PAYSYSTEM_IS_ONLINE

        PRICE
        PRICE_BASKET
        PRICE_BASKET_BASE
        PRICE_DISCOUNT
        PRICE_DELIVERY
        PRICE_TOTAL
        PRICE_PAY
        PRICE_PAY_BASE

        USER_DESCRIPTION
        BONUSES

        DELIVERY {
            ...DeliveryService
        }
        
        BASKET {
            ...BasketItemApp
        }

        ATTRS {
            ...OrderAttr
        }

        COUPONS {
            ...Coupon
        }
        
        COURIER_STATE {
            ...CourierState
        }

        PICKUP_DEPARTMENT {
            ID
            NAME
            COORDS {
                LON
                LAT
            }
        }
        
        CANCEL_REASONS {
            CODE
            NAME
        }
    }
    ${DeliveryService}
    ${BasketItem}
    ${OrderAttr}
    ${CourierState}
    ${Coupon}
`


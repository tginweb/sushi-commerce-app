import {gql} from "@apollo/client"

import BasketItem from "./BasketItem"
import OrderAttr from "~gql/fragments/OrderAttr"
import CourierState from "~gql/fragments/CourierState"
import ProductElement from "@core/catalog/gql/fragments/ProductElement"

export default gql`
    fragment ServiceOrder on ServiceOrder {
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

        PRICE
        PRICE_BASKET
        PRICE_BASKET_BASE
        PRICE_DISCOUNT
        PRICE_DELIVERY
        PRICE_TOTAL
        PRICE_PAY

        USER_DESCRIPTION
        BONUSES

        BASKET {
            ...BasketItemApp
            ELEMENT {
                ...ProductElement
            }
        }

        ATTRS {
            ...OrderAttr
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
    }
    ${BasketItem}
    ${OrderAttr}
    ${CourierState}
    ${ProductElement}
`


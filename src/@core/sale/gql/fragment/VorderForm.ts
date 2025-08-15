import {gql} from "@apollo/client"

import OrderAttr from "~gql/fragments/OrderAttr"
import DeliveryComputed from "~gql/fragments/DeliveryComputed"
import CompanyOffice from "@core/company/gql/fragments/Office"
import Coupon from "~gql/fragments/Coupon"
import DiscountItem from "~gql/fragments/DiscountItem"
import ProductElement from "@core/catalog/gql/fragments/ProductElement"

export default gql`
    fragment VorderForm on VorderForm {
        STATE
        TS
        STATE
        ATTRS {
            ...OrderAttr
        }
        DELIVERIES {
            ...DeliveryComputed
        }
        DEPARTMENTS {
            ...CompanyOffice
        }
        COUPONS {
            ...Coupon
            PRODUCT {
                ...ProductElement
            }
        }
        DISCOUNT {
            ...DiscountItem
        }
        DISCOUNTS {
            ...DiscountItem
        }
        SPECIAL_OFFERS {
            MIN_PRICE
            ELEMENT_ID
        }
        PROFILE_ID
        DELIVERY_CALCULATED
        DELIVERY_FREE_FROM_PRICE
        DELIVERY_DEPARTMENT_ID
        PICKUP_DEPARTMENT_ID
        DEPARTMENT_ID
        BONUSES_AVAILABLE
        BONUSES_PERCENT
        COUPON_CAN_ADD
    }
    ${ProductElement}
    ${OrderAttr}
    ${DeliveryComputed}
    ${CompanyOffice}
    ${Coupon}
    ${DiscountItem}
`


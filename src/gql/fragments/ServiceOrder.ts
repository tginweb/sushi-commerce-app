
import {gql} from "@apollo/client"

import OrderAttr from './OrderAttr'
import BasketItem from './BasketItem'
import OrderCancelReason from './OrderCancelReason'
import Coupon from './Coupon'
import CourierState from './CourierState'
import DeliveryService from './DeliveryService'
import CompanyOffice from './CompanyOffice'
import Payment from './Payment'
import Paysystem from './Paysystem'
import OrderPropValue from './OrderPropValue'
import OrderScope from './OrderScope'
import Element from './Element'
import OrderStatus from './OrderStatus'
import User from './User'
export default gql`

fragment ServiceOrder on ServiceOrder {
  ACCESS_HASH
  ACCOUNT_NUMBER
  ACTIONS
  ADDRESS_FOR_1C
  ATTRS {
    ...OrderAttr
  }
  BASKET {
    ...BasketItem
  }
  BONUSES
  BUYER_NAME
  CANCEL_REASONS {
    ...OrderCancelReason
  }
  CONTRACT_NUM
  COUPONS {
    ...Coupon
  }
  COURIER_STATE {
    ...CourierState
  }
  CSTATUS_COLOR
  CSTATUS_ID
  CSTATUS_NAME
  DATE_FORMATTED
  DATE_INSERT
  DATE_PAYED
  DATE_TIME_FORMATTED
  DATE_UPDATE
  DELIVERY {
    ...DeliveryService
  }
  DELIVERY_ADDRESS_FULL
  DELIVERY_CALCULATED
  DELIVERY_DATETIME
  DELIVERY_DEPARTMENT {
    ...CompanyOffice
  }
  DELIVERY_FREE_FROM_PRICE
  DELIVERY_ID
  DISCOUNT_PERCENT
  DISCOUNT_REASON
  EDU_GROUP_NUM
  ID
  IS_ACTIVE
  IS_CANCELED
  IS_CAN_CANCEL
  IS_CAN_PAY
  IS_CAN_PAY_BILL
  IS_CAN_PAY_ONLINE
  IS_FINISHED
  IS_PAID
  PAYMENTS {
    ...Payment
  }
  PAYSYSTEM {
    ...Paysystem
  }
  PAYSYSTEM_ID
  PAYSYSTEM_IS_ONLINE
  PAY_LINK
  PERSON_TYPE_ID
  PICKUP_DEPARTMENT {
    ...CompanyOffice
  }
  PRICE
  PRICE_BASKET
  PRICE_BASKET_BASE
  PRICE_DELIVERY
  PRICE_DELIVERY_BASE
  PRICE_DISCOUNT
  PRICE_PAY
  PRICE_PAY_BASE
  PRICE_TOTAL
  PRICE_TOTAL_BASE
  PROPS {
    ...OrderPropValue
  }
  SCOPE {
    ...OrderScope
  }
  SCOPE_ENTITY {
    ...Element
  }
  SECRET_URL
  SERVICE_ID
  STATUS {
    ...OrderStatus
  }
  STATUS_COLOR
  STATUS_ID
  STATUS_NAME
  STUDENT_FIO
  SYNCED
  TS
  URL
  USER {
    ...User
  }
  USER_DESCRIPTION
  USER_ID
}
${OrderAttr}
${BasketItem}
${OrderCancelReason}
${Coupon}
${CourierState}
${DeliveryService}
${CompanyOffice}
${Payment}
${Paysystem}
${OrderPropValue}
${OrderScope}
${Element}
${OrderStatus}
${User}
`

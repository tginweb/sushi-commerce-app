
import {gql} from "@apollo/client"

import Coupon from './Coupon'
import Vorder from './Vorder'
export default gql`

fragment VOrderCouponPayload on VOrderCouponPayload {
  coupon {
    ...Coupon
  }
  vorder {
    ...Vorder
  }
}
${Coupon}
${Vorder}
`

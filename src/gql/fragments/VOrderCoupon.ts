
import {gql} from "@apollo/client"

import VOrderCouponPayload from './VOrderCouponPayload'
import ResponseState from './ResponseState'
export default gql`

fragment VOrderCoupon on VOrderCoupon {
  payload {
    ...VOrderCouponPayload
  }
  state {
    ...ResponseState
  }
}
${VOrderCouponPayload}
${ResponseState}
`

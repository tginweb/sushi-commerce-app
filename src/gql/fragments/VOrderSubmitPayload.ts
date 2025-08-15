
import {gql} from "@apollo/client"

import Order from './Order'
import Vorder from './Vorder'
export default gql`

fragment VOrderSubmitPayload on VOrderSubmitPayload {
  order {
    ...Order
  }
  orderId
  orderUrl
  vorder {
    ...Vorder
  }
}
${Order}
${Vorder}
`

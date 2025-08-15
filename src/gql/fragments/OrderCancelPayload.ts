
import {gql} from "@apollo/client"

import Order from './Order'
export default gql`

fragment OrderCancelPayload on OrderCancelPayload {
  entity {
    ...Order
  }
}
${Order}
`

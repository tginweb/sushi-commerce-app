
import {gql} from "@apollo/client"

import OrderCancelPayload from './OrderCancelPayload'
import ResponseState from './ResponseState'
export default gql`

fragment OrderCancel on OrderCancel {
  payload {
    ...OrderCancelPayload
  }
  state {
    ...ResponseState
  }
}
${OrderCancelPayload}
${ResponseState}
`

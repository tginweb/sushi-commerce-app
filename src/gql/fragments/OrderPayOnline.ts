
import {gql} from "@apollo/client"

import OrderPayOnlinePayload from './OrderPayOnlinePayload'
import ResponseState from './ResponseState'
export default gql`

fragment OrderPayOnline on OrderPayOnline {
  payload {
    ...OrderPayOnlinePayload
  }
  state {
    ...ResponseState
  }
}
${OrderPayOnlinePayload}
${ResponseState}
`

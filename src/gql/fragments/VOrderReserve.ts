
import {gql} from "@apollo/client"

import VOrderReservePayload from './VOrderReservePayload'
import ResponseState from './ResponseState'
export default gql`

fragment VOrderReserve on VOrderReserve {
  payload {
    ...VOrderReservePayload
  }
  state {
    ...ResponseState
  }
}
${VOrderReservePayload}
${ResponseState}
`


import {gql} from "@apollo/client"

import VOrderBasketPayload from './VOrderBasketPayload'
import ResponseState from './ResponseState'
export default gql`

fragment VOrderBasket on VOrderBasket {
  payload {
    ...VOrderBasketPayload
  }
  state {
    ...ResponseState
  }
}
${VOrderBasketPayload}
${ResponseState}
`

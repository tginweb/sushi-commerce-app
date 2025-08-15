
import {gql} from "@apollo/client"

import VOrderSubmitPayload from './VOrderSubmitPayload'
import ResponseState from './ResponseState'
export default gql`

fragment VOrderSubmit on VOrderSubmit {
  payload {
    ...VOrderSubmitPayload
  }
  state {
    ...ResponseState
  }
}
${VOrderSubmitPayload}
${ResponseState}
`

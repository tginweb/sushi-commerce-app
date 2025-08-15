
import {gql} from "@apollo/client"

import VOrderApplyPayload from './VOrderApplyPayload'
import ResponseState from './ResponseState'
export default gql`

fragment VOrderApply on VOrderApply {
  payload {
    ...VOrderApplyPayload
  }
  state {
    ...ResponseState
  }
}
${VOrderApplyPayload}
${ResponseState}
`

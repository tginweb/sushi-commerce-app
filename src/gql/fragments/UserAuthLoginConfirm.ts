
import {gql} from "@apollo/client"

import UserAuthLoginConfirmPayload from './UserAuthLoginConfirmPayload'
import ResponseState from './ResponseState'
export default gql`

fragment UserAuthLoginConfirm on UserAuthLoginConfirm {
  payload {
    ...UserAuthLoginConfirmPayload
  }
  state {
    ...ResponseState
  }
}
${UserAuthLoginConfirmPayload}
${ResponseState}
`

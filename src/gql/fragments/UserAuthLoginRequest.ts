
import {gql} from "@apollo/client"

import UserAuthLoginRequestPayload from './UserAuthLoginRequestPayload'
import ResponseState from './ResponseState'
export default gql`

fragment UserAuthLoginRequest on UserAuthLoginRequest {
  payload {
    ...UserAuthLoginRequestPayload
  }
  state {
    ...ResponseState
  }
}
${UserAuthLoginRequestPayload}
${ResponseState}
`

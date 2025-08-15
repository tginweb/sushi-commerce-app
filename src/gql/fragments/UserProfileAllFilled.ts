
import {gql} from "@apollo/client"

import UserProfileAllFilledPayload from './UserProfileAllFilledPayload'
import ResponseState from './ResponseState'
export default gql`

fragment UserProfileAllFilled on UserProfileAllFilled {
  payload {
    ...UserProfileAllFilledPayload
  }
  state {
    ...ResponseState
  }
}
${UserProfileAllFilledPayload}
${ResponseState}
`


import {gql} from "@apollo/client"

import ResponseState from './ResponseState'
export default gql`

fragment CaptchaDraggableVerifyResult on CaptchaDraggableVerifyResult {
  id
  state {
    ...ResponseState
  }
}
${ResponseState}
`

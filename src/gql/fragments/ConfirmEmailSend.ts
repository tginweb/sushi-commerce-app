
import {gql} from "@apollo/client"

import ResponseState from './ResponseState'
export default gql`

fragment ConfirmEmailSend on ConfirmEmailSend {
  payload
  state {
    ...ResponseState
  }
}
${ResponseState}
`

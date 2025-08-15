
import {gql} from "@apollo/client"

import ResponseState from './ResponseState'
export default gql`

fragment ConfirmPhoneSubmit on ConfirmPhoneSubmit {
  payload
  state {
    ...ResponseState
  }
}
${ResponseState}
`

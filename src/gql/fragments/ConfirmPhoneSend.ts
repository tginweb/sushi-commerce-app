
import {gql} from "@apollo/client"

import ResponseState from './ResponseState'
export default gql`

fragment ConfirmPhoneSend on ConfirmPhoneSend {
  payload
  state {
    ...ResponseState
  }
}
${ResponseState}
`

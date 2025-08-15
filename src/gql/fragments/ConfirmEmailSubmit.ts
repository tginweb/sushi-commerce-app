
import {gql} from "@apollo/client"

import ResponseState from './ResponseState'
export default gql`

fragment ConfirmEmailSubmit on ConfirmEmailSubmit {
  payload
  state {
    ...ResponseState
  }
}
${ResponseState}
`

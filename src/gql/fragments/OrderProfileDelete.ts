
import {gql} from "@apollo/client"

import ResponseState from './ResponseState'
export default gql`

fragment OrderProfileDelete on OrderProfileDelete {
  payload
  state {
    ...ResponseState
  }
}
${ResponseState}
`

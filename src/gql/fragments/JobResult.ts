
import {gql} from "@apollo/client"

import ResponseState from './ResponseState'
export default gql`

fragment JobResult on JobResult {
  payload
  state {
    ...ResponseState
  }
}
${ResponseState}
`


import {gql} from "@apollo/client"

import ResponseState from './ResponseState'
export default gql`

fragment LoggerError on LoggerError {
  payload
  state {
    ...ResponseState
  }
}
${ResponseState}
`

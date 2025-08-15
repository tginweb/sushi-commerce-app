
import {gql} from "@apollo/client"

import ResponseState from './ResponseState'
export default gql`

fragment Response on Response {
  payload
  state {
    ...ResponseState
  }
}
${ResponseState}
`

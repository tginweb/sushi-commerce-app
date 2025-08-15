
import {gql} from "@apollo/client"

import ResponseState from './ResponseState'
export default gql`

fragment OrderProfileDefault on OrderProfileDefault {
  payload
  state {
    ...ResponseState
  }
}
${ResponseState}
`

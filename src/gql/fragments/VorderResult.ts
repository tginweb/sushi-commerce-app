
import {gql} from "@apollo/client"

import Vorder from './Vorder'
import ResponseState from './ResponseState'
export default gql`

fragment VorderResult on VorderResult {
  data
  payload {
    ...Vorder
  }
  state {
    ...ResponseState
  }
}
${Vorder}
${ResponseState}
`

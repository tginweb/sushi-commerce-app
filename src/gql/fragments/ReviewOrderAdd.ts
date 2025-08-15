
import {gql} from "@apollo/client"

import ReviewElement from './ReviewElement'
import ResponseState from './ResponseState'
export default gql`

fragment ReviewOrderAdd on ReviewOrderAdd {
  payload {
    ...ReviewElement
  }
  state {
    ...ResponseState
  }
}
${ReviewElement}
${ResponseState}
`

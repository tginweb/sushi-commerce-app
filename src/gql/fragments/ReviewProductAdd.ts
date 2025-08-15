
import {gql} from "@apollo/client"

import ReviewElement from './ReviewElement'
import ResponseState from './ResponseState'
export default gql`

fragment ReviewProductAdd on ReviewProductAdd {
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

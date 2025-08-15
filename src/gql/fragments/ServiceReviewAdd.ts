
import {gql} from "@apollo/client"

import ReviewElement from './ReviewElement'
import ResponseState from './ResponseState'
export default gql`

fragment ServiceReviewAdd on ServiceReviewAdd {
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

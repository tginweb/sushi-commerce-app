
import {gql} from "@apollo/client"

import User from './User'
import ResponseState from './ResponseState'
export default gql`

fragment UserProfileSave on UserProfileSave {
  payload {
    ...User
  }
  state {
    ...ResponseState
  }
}
${User}
${ResponseState}
`


import {gql} from "@apollo/client"

import User from './User'
import ResponseState from './ResponseState'
export default gql`

fragment MutationUserProfileEmail on MutationUserProfileEmail {
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

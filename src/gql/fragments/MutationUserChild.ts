
import {gql} from "@apollo/client"

import ResponseState from './ResponseState'
import User from './User'
export default gql`

fragment MutationUserChild on MutationUserChild {
  state {
    ...ResponseState
  }
  user {
    ...User
  }
}
${ResponseState}
${User}
`

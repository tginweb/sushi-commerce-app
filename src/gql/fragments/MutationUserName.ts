
import {gql} from "@apollo/client"

import ResponseState from './ResponseState'
import User from './User'
export default gql`

fragment MutationUserName on MutationUserName {
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


import {gql} from "@apollo/client"

import ResponseState from './ResponseState'
import User from './User'
export default gql`

fragment MutationUserBirthday on MutationUserBirthday {
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

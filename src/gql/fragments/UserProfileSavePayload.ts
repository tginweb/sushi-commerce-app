
import {gql} from "@apollo/client"

import User from './User'
export default gql`

fragment UserProfileSavePayload on UserProfileSavePayload {
  user {
    ...User
  }
}
${User}
`

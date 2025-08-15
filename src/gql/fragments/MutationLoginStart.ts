
import {gql} from "@apollo/client"

import UserAuthConfirm from './UserAuthConfirm'
import ResponseState from './ResponseState'
export default gql`

fragment MutationLoginStart on MutationLoginStart {
  confirmModes {
    ...UserAuthConfirm
  }
  state {
    ...ResponseState
  }
}
${UserAuthConfirm}
${ResponseState}
`

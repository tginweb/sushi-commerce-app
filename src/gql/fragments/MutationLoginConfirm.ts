
import {gql} from "@apollo/client"

import AppClient from './AppClient'
import ResponseState from './ResponseState'
export default gql`

fragment MutationLoginConfirm on MutationLoginConfirm {
  appClient {
    ...AppClient
  }
  redirect
  sessionId
  state {
    ...ResponseState
  }
  userId
}
${AppClient}
${ResponseState}
`


import {gql} from "@apollo/client"

import AppClient from './AppClient'
import ResponseState from './ResponseState'
export default gql`

fragment MutationLogout on MutationLogout {
  appClient {
    ...AppClient
  }
  state {
    ...ResponseState
  }
}
${AppClient}
${ResponseState}
`

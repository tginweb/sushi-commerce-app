
import {gql} from "@apollo/client"

import AppClientDebugParams from './AppClientDebugParams'
export default gql`

fragment AppClient on AppClient {
  ACTIONS
  CLIENT_ID
  CURRENT_SESSION_ID
  DEBUG_PARAMS {
    ...AppClientDebugParams
  }
  ID
  MOBILE_PUSH_TOKEN
  SESSION_ID
  TOKEN
  USER_ID
  WEB_PUSH_TOKEN
}
${AppClientDebugParams}
`


import {gql} from "@apollo/client"

import NoticeSyncReadedPayload from './NoticeSyncReadedPayload'
import ResponseState from './ResponseState'
export default gql`

fragment NoticeSyncReaded on NoticeSyncReaded {
  payload {
    ...NoticeSyncReadedPayload
  }
  state {
    ...ResponseState
  }
}
${NoticeSyncReadedPayload}
${ResponseState}
`

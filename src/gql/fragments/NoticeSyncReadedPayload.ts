
import {gql} from "@apollo/client"

import ClientNotice from './ClientNotice'
export default gql`

fragment NoticeSyncReadedPayload on NoticeSyncReadedPayload {
  notices {
    ...ClientNotice
  }
}
${ClientNotice}
`

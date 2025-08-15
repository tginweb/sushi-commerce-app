
import {gql} from "@apollo/client"

import ClientNotice from './ClientNotice'
export default gql`

fragment UserProfileAllFilledPayload on UserProfileAllFilledPayload {
  notice {
    ...ClientNotice
  }
}
${ClientNotice}
`


import {gql} from "@apollo/client"

import Vorder from './Vorder'
export default gql`

fragment VOrderApplyPayload on VOrderApplyPayload {
  vorder {
    ...Vorder
  }
}
${Vorder}
`

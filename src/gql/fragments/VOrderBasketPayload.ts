
import {gql} from "@apollo/client"

import Vorder from './Vorder'
export default gql`

fragment VOrderBasketPayload on VOrderBasketPayload {
  vorder {
    ...Vorder
  }
}
${Vorder}
`


import {gql} from "@apollo/client"

import ResponseState from './ResponseState'
export default gql`

fragment sale_pub_buyer_company_delete on sale_pub_buyer_company_delete {
  payload
  state {
    ...ResponseState
  }
}
${ResponseState}
`

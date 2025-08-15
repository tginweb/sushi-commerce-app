
import {gql} from "@apollo/client"

import ResponseState from './ResponseState'
export default gql`

fragment sale_pub_buyer_company_default on sale_pub_buyer_company_default {
  payload
  state {
    ...ResponseState
  }
}
${ResponseState}
`

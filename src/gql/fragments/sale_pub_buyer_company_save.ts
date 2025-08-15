
import {gql} from "@apollo/client"

import BuyerCompanyElement from './BuyerCompanyElement'
import ResponseState from './ResponseState'
export default gql`

fragment sale_pub_buyer_company_save on sale_pub_buyer_company_save {
  payload {
    ...BuyerCompanyElement
  }
  state {
    ...ResponseState
  }
}
${BuyerCompanyElement}
${ResponseState}
`

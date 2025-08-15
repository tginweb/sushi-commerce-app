
import {gql} from "@apollo/client"

import Paysystem from './Paysystem'
export default gql`

fragment Payment on Payment {
  DATE_PAID
  ID
  IS_PAID
  ORDER_ID
  ORDER_URL
  PAYSYSTEM {
    ...Paysystem
  }
  PAYSYSTEM_ID
  PAY_NAV
  PS_INVOICE_ID
  PS_STATUS
  PS_STATUS_CODE
  PS_STATUS_ID
  PS_STATUS_NAME
  SUM
  SUM_PAID
}
${Paysystem}
`

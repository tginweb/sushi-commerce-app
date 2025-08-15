
import {gql} from "@apollo/client"

import DiscountCondition from './DiscountCondition'
import Discount from './Discount'
export default gql`

fragment DiscountItem on DiscountItem {
  CAPTION
  CODE
  CONDITIONS {
    ...DiscountCondition
  }
  DISCOUNT {
    ...Discount
  }
  DISCOUNT_ID
  HOTEST
  ID
  NAME
  NAME_TEMPLATE
  PERCENT
}
${DiscountCondition}
${Discount}
`


import {gql} from "@apollo/client"

import DiscountCondition from './DiscountCondition'
export default gql`

fragment Discount on Discount {
  CODE
  CONDITIONS {
    ...DiscountCondition
  }
  ID
  NAME
}
${DiscountCondition}
`

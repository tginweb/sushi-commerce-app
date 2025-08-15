
import {gql} from "@apollo/client"

import DiscountItem from './DiscountItem'
import BonusLevelElement from './BonusLevelElement'
export default gql`

fragment SaleClientCard on SaleClientCard {
  BONUSES
  BONUSES_EXPIRE
  BONUSES_PERCENT
  CLIENT_PHONE
  DISCOUNTS {
    ...DiscountItem
  }
  DIS_FIRST_ORDER
  DIS_SELF_PICKUP
  EXPIRED
  FETCHED
  FETCHED_ACTUAL
  GIFTS
  ID
  LEVEL {
    ...BonusLevelElement
  }
  LEVEL_CODE
  LEVEL_NAME
  MONTH_SPENT
}
${DiscountItem}
${BonusLevelElement}
`

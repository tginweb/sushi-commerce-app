
import {gql} from "@apollo/client"


export default gql`

fragment BonusLevelElement on BonusLevelElement {
  ACCUMULATION_PERCENT
  CODE
  COLOR
  ID
  MAX_USE_PERCENT
  MONTH_SPENT_MAX
  MONTH_SPENT_MIN
  NAME
  ORDERS_SUMM
}

`

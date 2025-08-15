
import {gql} from "@apollo/client"

import BasketItemProp from './BasketItemProp'
export default gql`

fragment BasketItem on BasketItem {
  BASE_PRICE
  CLIENT_ID
  COMMENT
  DESC
  DISABLE
  DISABLE_REASON
  FINAL_PRICE
  FINAL_PRICE_BASE
  ID
  INPUT_PROPS_HASH
  MEASURE_NAME
  NAME
  ORDER_ID
  PAID
  PRICE
  PRICE_BASE
  PRODUCT_ID
  PROPS {
    ...BasketItemProp
  }
  QUANTITY
}
${BasketItemProp}
`

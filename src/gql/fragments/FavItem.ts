
import {gql} from "@apollo/client"

import BasketBuildItem from './BasketBuildItem'
import ProductElement from './ProductElement'
import BasketItemProp from './BasketItemProp'
export default gql`

fragment FavItem on FavItem {
  BASE_PRICE
  BUILD {
    ...BasketBuildItem
  }
  CLIENT_ID
  COMMENT
  DESC
  DISABLE
  DISABLE_REASON
  ELEMENT {
    ...ProductElement
  }
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
${BasketBuildItem}
${ProductElement}
${BasketItemProp}
`

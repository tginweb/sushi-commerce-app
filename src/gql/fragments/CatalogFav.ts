
import {gql} from "@apollo/client"

import BasketItem from './BasketItem'
export default gql`

fragment CatalogFav on CatalogFav {
  ACTIONS
  BASKET_HASH
  BASKET_ITEM {
    ...BasketItem
  }
  ELEMENT_ID
  IBLOCK_ID
  ID
  SALES_COUNT
  TYPE
  TYPE_NAME
  USER_ID
}
${BasketItem}
`

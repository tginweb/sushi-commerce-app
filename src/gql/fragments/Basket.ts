
import {gql} from "@apollo/client"

import BasketItem from './BasketItem'
import SpecialOffer from './SpecialOffer'
export default gql`

fragment Basket on Basket {
  BASE_PRICE
  COUNT
  HASH
  ITEMS {
    ...BasketItem
  }
  MIN_PRICE
  MIN_PRICE_REACHED
  OFFERS {
    ...SpecialOffer
  }
  PRICE
  QUANTITY
  SYNCED
  TS
  WEIGHT
}
${BasketItem}
${SpecialOffer}
`


import {gql} from "@apollo/client"

import ProductElement from './ProductElement'
import SpecialOfferType from './SpecialOfferType'
export default gql`

fragment SpecialOffer on SpecialOffer {
  ELEMENT {
    ...ProductElement
  }
  ELEMENT_ID
  MIN_PRICE
  MODE
  TYPE
  TYPE_INFO {
    ...SpecialOfferType
  }
}
${ProductElement}
${SpecialOfferType}
`

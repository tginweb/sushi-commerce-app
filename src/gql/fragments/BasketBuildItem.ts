
import {gql} from "@apollo/client"

import ProductElement from './ProductElement'
export default gql`

fragment BasketBuildItem on BasketBuildItem {
  ELEMENT {
    ...ProductElement
  }
  PRODUCT_ID
  QUANTITY
}
${ProductElement}
`

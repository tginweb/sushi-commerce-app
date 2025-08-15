
import {gql} from "@apollo/client"

import ProductElement from './ProductElement'
import ProductSection from './ProductSection'
export default gql`

fragment SearchResult on SearchResult {
  ELEMENTS {
    ...ProductElement
  }
  SECTIONS {
    ...ProductSection
  }
}
${ProductElement}
${ProductSection}
`

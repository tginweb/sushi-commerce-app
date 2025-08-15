
import {gql} from "@apollo/client"

import QueryInfo from './QueryInfo'
import ProductElement from './ProductElement'
export default gql`

fragment ProductElementConnection on ProductElementConnection {
  info {
    ...QueryInfo
  }
  nodes {
    ...ProductElement
  }
}
${QueryInfo}
${ProductElement}
`

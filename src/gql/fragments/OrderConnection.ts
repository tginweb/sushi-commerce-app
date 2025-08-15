
import {gql} from "@apollo/client"

import QueryInfo from './QueryInfo'
import Order from './Order'
export default gql`

fragment OrderConnection on OrderConnection {
  info {
    ...QueryInfo
  }
  nodes {
    ...Order
  }
}
${QueryInfo}
${Order}
`

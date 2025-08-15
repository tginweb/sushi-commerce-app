
import {gql} from "@apollo/client"

import QueryInfo from './QueryInfo'
import Element from './Element'
export default gql`

fragment ElementConnection on ElementConnection {
  info {
    ...QueryInfo
  }
  nodes {
    ...Element
  }
}
${QueryInfo}
${Element}
`

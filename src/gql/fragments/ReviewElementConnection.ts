
import {gql} from "@apollo/client"

import QueryInfo from './QueryInfo'
import ReviewElement from './ReviewElement'
export default gql`

fragment ReviewElementConnection on ReviewElementConnection {
  info {
    ...QueryInfo
  }
  nodes {
    ...ReviewElement
  }
}
${QueryInfo}
${ReviewElement}
`

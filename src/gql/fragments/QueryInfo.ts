
import {gql} from "@apollo/client"


export default gql`

fragment QueryInfo on QueryInfo {
  limit
  nextPage
  page
  pages
  total
}

`

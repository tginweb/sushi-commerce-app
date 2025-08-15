
import {gql} from "@apollo/client"


export default gql`

fragment ElementMeta on ElementMeta {
  DESCRIPTION
  KEYWORDS
  PAGE_TITLE
  TITLE
}

`

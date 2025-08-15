
import {gql} from "@apollo/client"


export default gql`

fragment VorderSummary on VorderSummary {
  EMAIL
  FUSER_ID
  ID
  PHONE
}

`

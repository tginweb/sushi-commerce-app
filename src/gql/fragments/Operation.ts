
import {gql} from "@apollo/client"


export default gql`

fragment Operation on Operation {
  ID
  NAME
  PROCESSED
  PROCESSED_REDIRECT
  SID
}

`

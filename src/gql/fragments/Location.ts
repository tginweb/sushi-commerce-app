
import {gql} from "@apollo/client"


export default gql`

fragment Location on Location {
  CODE
  ID
  NAME
  REGION {
    ...Location
  }
}

`


import {gql} from "@apollo/client"


export default gql`

fragment UserFamily on UserFamily {
  ACTIONS
  BIRTHDAY
  ID
  NAME
  RELATION
  USER_ID
}

`

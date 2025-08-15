
import {gql} from "@apollo/client"


export default gql`

fragment OrderStatus on OrderStatus {
  COLOR
  ID
  NAME
  SORT
  TYPE
}

`

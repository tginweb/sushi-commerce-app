
import {gql} from "@apollo/client"


export default gql`

fragment PersonType on PersonType {
  CODE
  ID
  IS_COMPANY
  NAME
  RESTRICTED
  SORT
}

`

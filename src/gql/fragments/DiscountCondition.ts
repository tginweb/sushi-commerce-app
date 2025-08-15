
import {gql} from "@apollo/client"


export default gql`

fragment DiscountCondition on DiscountCondition {
  ID
  NAME
  TYPE
  VALUE
}

`

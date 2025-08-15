
import {gql} from "@apollo/client"


export default gql`

fragment Condition on Condition {
  eq
  gt
  lt
  path
}

`


import {gql} from "@apollo/client"


export default gql`

fragment OrderCancelReason on OrderCancelReason {
  CODE
  NAME
}

`

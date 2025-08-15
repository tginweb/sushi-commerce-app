
import {gql} from "@apollo/client"


export default gql`

fragment OrderPropGroup on OrderPropGroup {
  ID
  NAME
  PERSON_TYPE_ID
  SORT
}

`

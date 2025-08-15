
import {gql} from "@apollo/client"


export default gql`

fragment VorderFields on VorderFields {
  DATA
  DELIVERY_ID
  PAY_SYSTEM_ID
  PERSON_TYPE_ID
  USER_DESCRIPTION
}

`

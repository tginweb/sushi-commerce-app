
import {gql} from "@apollo/client"


export default gql`

fragment OrderScope on OrderScope {
  CONTRACT_NUM
  ENTITY_ID
  ENTITY_TYPE
}

`

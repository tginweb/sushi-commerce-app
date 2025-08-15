
import {gql} from "@apollo/client"


export default gql`

fragment DeliveryService on DeliveryService {
  ID
  NAME
  PARENT_ID
  TRANSPORT_TYPE
}

`

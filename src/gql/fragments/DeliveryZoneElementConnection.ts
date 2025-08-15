
import {gql} from "@apollo/client"

import QueryInfo from './QueryInfo'
import DeliveryZoneElement from './DeliveryZoneElement'
export default gql`

fragment DeliveryZoneElementConnection on DeliveryZoneElementConnection {
  info {
    ...QueryInfo
  }
  nodes {
    ...DeliveryZoneElement
  }
}
${QueryInfo}
${DeliveryZoneElement}
`

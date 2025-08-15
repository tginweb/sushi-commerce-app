
import {gql} from "@apollo/client"

import Vorder from './Vorder'
export default gql`

fragment VOrderReservePayload on VOrderReservePayload {
  deliveryFreeFromPrice
  deliveryPrice
  departmentId
  departmentName
  departmentServiceId
  departmentServiceName
  profileId
  timeAvailable
  timeAvailableFormatted
  vorder {
    ...Vorder
  }
}
${Vorder}
`

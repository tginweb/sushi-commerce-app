
import {gql} from "@apollo/client"

import DeliveryService from './DeliveryService'
export default gql`

fragment DeliveryComputed on DeliveryComputed {
  CALCULATE_DESCRIPTION
  CALCULATE_ERRORS
  CALC_TIMESTAMP
  DELIVERY_DISCOUNT_PRICE
  DELIVERY_DISCOUNT_PRICE_FORMATED
  ID
  NAME
  PERIOD_TEXT
  PRICE
  PRICE_FORMATED
  SERVICE {
    ...DeliveryService
  }
}
${DeliveryService}
`

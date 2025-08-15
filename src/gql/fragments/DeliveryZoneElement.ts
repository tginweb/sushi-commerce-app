
import {gql} from "@apollo/client"


export default gql`

fragment DeliveryZoneElement on DeliveryZoneElement {
  CODE
  ID
  NAME
  PREVIEW_TEXT
  PROP_COLOR
  PROP_FREE_FROM_PRICE
  PROP_FREE_TEXT
  PROP_GEOJSON
  PROP_OUTSIDE
  PROP_PRICE_BY_DELIVERY
  PROP_PRICE_BY_KM
  PROP_PRICE_TEXT
}

`

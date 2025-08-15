
import {gql} from "@apollo/client"


export default gql`

fragment CourierState on CourierState {
  ARRIVAL_TIME
  ARRIVAL_TIME_CAPTION
  CAR_COLOR
  CAR_NUMBER
  COORDS
}

`

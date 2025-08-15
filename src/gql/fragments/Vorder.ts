
import {gql} from "@apollo/client"

import Basket from './Basket'
import VorderForm from './VorderForm'
import Order from './Order'
import User from './User'
export default gql`

fragment Vorder on Vorder {
  ACTIONS
  BASKET {
    ...Basket
  }
  EMAIL
  FIELDS_RAW
  FORM {
    ...VorderForm
  }
  FUSER_ID
  ID
  ORDER {
    ...Order
  }
  ORDER_ID
  PHONE
  PROPS_RAW
  SESSION_ID
  USER {
    ...User
  }
  USER_ID
}
${Basket}
${VorderForm}
${Order}
${User}
`

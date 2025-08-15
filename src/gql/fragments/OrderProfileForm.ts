
import {gql} from "@apollo/client"

import OrderAttr from './OrderAttr'
import BuyerCompanyElement from './BuyerCompanyElement'
import Coordinates from './Coordinates'
import PersonType from './PersonType'
import OrderPropValue from './OrderPropValue'
import User from './User'
export default gql`

fragment OrderProfileForm on OrderProfileForm {
  ACTIONS
  ATTRS {
    ...OrderAttr
  }
  CAPTION
  COMPANIES {
    ...BuyerCompanyElement
  }
  COMPANY {
    ...BuyerCompanyElement
  }
  COMPANY_ID
  COORDS {
    ...Coordinates
  }
  DELIVERY_FREE_FROM_PRICE
  ID
  IS_DEFAULT
  NAME
  PERSON_TYPE {
    ...PersonType
  }
  PERSON_TYPES {
    ...PersonType
  }
  PERSON_TYPE_ID
  PROPS {
    ...OrderPropValue
  }
  USER {
    ...User
  }
  USER_ID
}
${OrderAttr}
${BuyerCompanyElement}
${Coordinates}
${PersonType}
${OrderPropValue}
${User}
`

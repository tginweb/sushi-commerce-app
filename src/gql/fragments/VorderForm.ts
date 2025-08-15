
import {gql} from "@apollo/client"

import OrderAttr from './OrderAttr'
import BuyerCompanyElement from './BuyerCompanyElement'
import Coupon from './Coupon'
import DeliveryComputed from './DeliveryComputed'
import CompanyOffice from './CompanyOffice'
import DiscountItem from './DiscountItem'
import VorderFields from './VorderFields'
import Paycard from './Paycard'
import PaysystemComputed from './PaysystemComputed'
import PersonType from './PersonType'
import OrderProfile from './OrderProfile'
import OrderPropValue from './OrderPropValue'
import SpecialOffer from './SpecialOffer'
export default gql`

fragment VorderForm on VorderForm {
  ATTRS {
    ...OrderAttr
  }
  BONUSES
  BONUSES_AVAILABLE
  BONUSES_PERCENT
  COMPANIES {
    ...BuyerCompanyElement
  }
  COMPANY_ID
  COUPONS {
    ...Coupon
  }
  COUPON_CAN_ADD
  DELIVERIES {
    ...DeliveryComputed
  }
  DELIVERY_CALCULATED
  DELIVERY_DEPARTMENT_ID
  DELIVERY_FREE_FROM_PRICE
  DEPARTMENTS {
    ...CompanyOffice
  }
  DEPARTMENT_ID
  DISCOUNT {
    ...DiscountItem
  }
  DISCOUNTS {
    ...DiscountItem
  }
  FIELDS {
    ...VorderFields
  }
  PAYCARDS {
    ...Paycard
  }
  PAYCARD_SID
  PAYSYSTEMS {
    ...PaysystemComputed
  }
  PERSON_TYPES {
    ...PersonType
  }
  PICKUP_DEPARTMENT_ID
  PROFILES {
    ...OrderProfile
  }
  PROFILE_ID
  PROPS {
    ...OrderPropValue
  }
  SPECIAL_OFFERS {
    ...SpecialOffer
  }
  STATE
  SYNCED
  TS
}
${OrderAttr}
${BuyerCompanyElement}
${Coupon}
${DeliveryComputed}
${CompanyOffice}
${DiscountItem}
${VorderFields}
${Paycard}
${PaysystemComputed}
${PersonType}
${OrderProfile}
${OrderPropValue}
${SpecialOffer}
`

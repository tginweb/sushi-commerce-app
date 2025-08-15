
import {gql} from "@apollo/client"


export default gql`

fragment Coupon on Coupon {
  COUPON
  ID
  NAME
  PRODUCT_ID
}

`

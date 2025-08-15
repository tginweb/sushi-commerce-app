
import {gql} from "@apollo/client"


export default gql`

fragment ProductPrice on ProductPrice {
  DISCOUNTED
  DISCOUNT_PERCENT
  PRICE
}

`


import {gql} from "@apollo/client"

import Image from './Image'
export default gql`

fragment ProductGift on ProductGift {
  GIFT_ID
  IMAGE {
    ...Image
  }
  NAME
}
${Image}
`

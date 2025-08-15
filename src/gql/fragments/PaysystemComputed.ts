
import {gql} from "@apollo/client"

import Paysystem from './Paysystem'
export default gql`

fragment PaysystemComputed on PaysystemComputed {
  CALC_TIMESTAMP
  ID
  NAME
  PRICE
  PRICE_FORMATED
  SERVICE {
    ...Paysystem
  }
}
${Paysystem}
`

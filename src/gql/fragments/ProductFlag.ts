
import {gql} from "@apollo/client"


export default gql`

fragment ProductFlag on ProductFlag {
  CODE
  COLOR
  COLOR_HEX
  MOBILE_TEXT_CLASS
  MOBILE_TEXT_CLASS_DETAIL
  NAME
  NAME_SHORT
}

`


import {gql} from "@apollo/client"

import OrderAttrOption from './OrderAttrOption'
export default gql`

fragment OrderAttr on OrderAttr {
  ATTR_TYPE
  CODE
  DEFAULT_VALUE
  NAME
  OPTIONS {
    ...OrderAttrOption
  }
  VALUE
  VALUE_DESCRIPTION
  VALUE_VIEW
}
${OrderAttrOption}
`

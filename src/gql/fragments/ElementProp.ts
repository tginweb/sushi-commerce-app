
import {gql} from "@apollo/client"

import Image from './Image'
import ElementPropEnum from './ElementPropEnum'
export default gql`

fragment ElementProp on ElementProp {
  CODE
  DESC
  FEATURES
  FILE {
    ...Image
  }
  FILES {
    ...Image
  }
  ID
  MUL
  NAME
  OPTIONS {
    ...ElementPropEnum
  }
  TYPE
  VAL
  VAL_ENUM_ID
  VAL_ID
}
${Image}
${ElementPropEnum}
`

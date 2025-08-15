
import {gql} from "@apollo/client"

import Image from './Image'
export default gql`

fragment EntityProp on EntityProp {
  CODE
  DESC
  FILE {
    ...Image
  }
  FILES {
    ...Image
  }
  ID
  MUL
  NAME
  TYPE
  VAL
  VAL_ENUM_ID
  VAL_ID
}
${Image}
`

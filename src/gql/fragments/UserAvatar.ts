
import {gql} from "@apollo/client"

import Image from './Image'
export default gql`

fragment UserAvatar on UserAvatar {
  ELEMENT_ID
  IMAGE {
    ...Image
  }
}
${Image}
`

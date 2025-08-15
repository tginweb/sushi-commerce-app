
import {gql} from "@apollo/client"

import Image from './Image'
export default gql`

fragment OfferSlide on OfferSlide {
  BG_COLOR
  CODE
  CONTENT_HTML
  CONTENT_IMAGE {
    ...Image
  }
  CONTENT_TYPE
  ID
  NAME
}
${Image}
`

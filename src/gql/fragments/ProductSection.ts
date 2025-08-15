
import {gql} from "@apollo/client"

import ElementMeta from './ElementMeta'
import Image from './Image'
export default gql`

fragment ProductSection on ProductSection {
  CODE
  ELEMENT_CNT
  IBLOCK_SECTION_ID
  ID
  META {
    ...ElementMeta
  }
  NAME
  PARENT {
    ...ProductSection
  }
  PARENTS {
    ...ProductSection
  }
  PICTURE {
    ...Image
  }
  REPLACE_LINK
  SORT
  URL
}
${ElementMeta}
${Image}
`

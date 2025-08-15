
import {gql} from "@apollo/client"

import ProductElement from './ProductElement'
import ElementMeta from './ElementMeta'
import Image from './Image'
import EntityProp from './EntityProp'
export default gql`

fragment Section on Section {
  CHILDREN {
    ...Section
  }
  CODE
  ELEMENTS {
    ...ProductElement
  }
  ELEMENT_CNT
  IBLOCK_SECTION_ID
  ID
  META {
    ...ElementMeta
  }
  NAME
  PARENT {
    ...Section
  }
  PARENTS {
    ...Section
  }
  PICTURE {
    ...Image
  }
  PROPS {
    ...EntityProp
  }
  REPLACE_LINK
  SORT
  URL
}
${ProductElement}
${ElementMeta}
${Image}
${EntityProp}
`

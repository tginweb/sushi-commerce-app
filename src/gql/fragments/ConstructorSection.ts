
import {gql} from "@apollo/client"

import ProductElement from './ProductElement'
import ElementMeta from './ElementMeta'
import Image from './Image'
import EntityProp from './EntityProp'
export default gql`

fragment ConstructorSection on ConstructorSection {
  BUILD_IBLOCK_ID
  BUILD_POP_SECTION
  CHILDREN {
    ...ConstructorSection
  }
  CODE
  ELEMENTS {
    ...ProductElement
  }
  ELEMENT_CNT
  IBLOCK_SECTION_ID
  ID
  IS_CORE
  META {
    ...ElementMeta
  }
  NAME
  PARENT {
    ...ConstructorSection
  }
  PARENTS {
    ...ConstructorSection
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

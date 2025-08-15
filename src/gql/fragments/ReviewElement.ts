
import {gql} from "@apollo/client"

import Image from './Image'
import Element from './Element'
import ElementMeta from './ElementMeta'
import Order from './Order'
import Section from './Section'
import ElementProp from './ElementProp'
import UserSafe from './UserSafe'
export default gql`

fragment ReviewElement on ReviewElement {
  ACTIONS
  ACTIVE
  ACTIVE_FROM
  ADMIN_URL
  CHILDREN {
    ...ReviewElement
  }
  CODE
  CREATED
  DETAIL_IMAGE {
    ...Image
  }
  DETAIL_TEXT
  ELEMENT {
    ...Element
  }
  IBLOCK_CODE
  IBLOCK_ID
  IBLOCK_SECTION_ID
  IBLOCK_SECTION_IDS
  ID
  LIST_IMAGE {
    ...Image
  }
  META {
    ...ElementMeta
  }
  NAME
  ORDER {
    ...Order
  }
  ORDER_ID
  PATH {
    ...Section
  }
  PREVIEW_TEXT
  PROPS {
    ...ElementProp
  }
  PROPS_VALUES {
    ...ElementProp
  }
  PROP_AUTHOR_NAME
  PROP_CONTEXT_ID
  PROP_ELEMENT_ID
  PROP_RATING
  PROP_TARGET_XML_ID
  RATING
  RATING_VOTES
  ROOT_SECTION {
    ...Section
  }
  SECTION {
    ...Section
  }
  SECTIONS {
    ...Section
  }
  SORT
  URL
  USER {
    ...UserSafe
  }
}
${Image}
${Element}
${ElementMeta}
${Order}
${Section}
${ElementProp}
${UserSafe}
`

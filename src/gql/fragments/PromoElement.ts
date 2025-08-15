
import {gql} from "@apollo/client"

import Image from './Image'
import ElementMeta from './ElementMeta'
import MenuItem from './MenuItem'
import Section from './Section'
import ElementProp from './ElementProp'
export default gql`

fragment PromoElement on PromoElement {
  ACTIONS
  ACTIVE
  ACTIVE_FROM
  ADMIN_URL
  CODE
  CREATED
  DETAIL_IMAGE {
    ...Image
  }
  DETAIL_TEXT
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
  MOBILE_ACTION {
    ...MenuItem
  }
  NAME
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
  WEB_ACTION {
    ...MenuItem
  }
}
${Image}
${ElementMeta}
${MenuItem}
${Section}
${ElementProp}
`

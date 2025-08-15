
import {gql} from "@apollo/client"

import MenuItemMobile from './MenuItemMobile'
import Image from './Image'
import ElementMeta from './ElementMeta'
import Section from './Section'
import ElementProp from './ElementProp'
export default gql`

fragment FaqElement on FaqElement {
  ACTIONS
  ACTIONS_MOBILE {
    ...MenuItemMobile
  }
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
}
${MenuItemMobile}
${Image}
${ElementMeta}
${Section}
${ElementProp}
`


import {gql} from "@apollo/client"

import Image from './Image'
import ElementMeta from './ElementMeta'
import Section from './Section'
import ElementProp from './ElementProp'
export default gql`

fragment CompanyContact on CompanyContact {
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
  PROP_EMAIL
  PROP_JOB
  PROP_OFFICE
  PROP_PHONE
  PROP_PHONE_WHATSAPP
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
${Image}
${ElementMeta}
${Section}
${ElementProp}
`

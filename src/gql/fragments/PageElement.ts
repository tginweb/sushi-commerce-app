
import {gql} from "@apollo/client"

import PageContentChunk from './PageContentChunk'
import PageDataChunk from './PageDataChunk'
import Image from './Image'
import ElementMeta from './ElementMeta'
import Section from './Section'
import ElementProp from './ElementProp'
export default gql`

fragment PageElement on PageElement {
  ACTIONS
  ACTIVE
  ACTIVE_FROM
  ADMIN_URL
  CODE
  CONTENT_CHUNKS {
    ...PageContentChunk
  }
  CREATED
  DATA_CHUNKS {
    ...PageDataChunk
  }
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
  PROP_TPL_PAGE_CONTENT
  PROP_TPL_PAGE_VIEW
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
${PageContentChunk}
${PageDataChunk}
${Image}
${ElementMeta}
${Section}
${ElementProp}
`

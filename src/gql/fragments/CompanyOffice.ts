
import {gql} from "@apollo/client"

import Coordinates from './Coordinates'
import Image from './Image'
import ElementMeta from './ElementMeta'
import Section from './Section'
import ElementProp from './ElementProp'
export default gql`

fragment CompanyOffice on CompanyOffice {
  ACTIONS
  ACTIVE
  ACTIVE_FROM
  ADMIN_URL
  CODE
  COORDS {
    ...Coordinates
  }
  CREATED
  DEBUG
  DETAIL_IMAGE {
    ...Image
  }
  DETAIL_TEXT
  DISABLE
  DISABLE_REASON
  DISTANCE
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
  ROLES
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
  WORKTIME
  WORKTIME_NOW
  WORKTIME_TODAY
  WORKTIME_WEEK
}
${Coordinates}
${Image}
${ElementMeta}
${Section}
${ElementProp}
`

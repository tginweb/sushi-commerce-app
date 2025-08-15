
import {gql} from "@apollo/client"

import MenuItemMobile from './MenuItemMobile'
import UfEnum from './UfEnum'
export default gql`

fragment Notice on Notice {
  ACTIONS
  ACTIONS_MOBILE {
    ...MenuItemMobile
  }
  BODY
  CREATED_AT
  EVENT_DATA
  EVENT_NAME
  GROUP
  ID
  MESSAGE
  READED
  TARGET {
    ...UfEnum
  }
  TITLE
}
${MenuItemMobile}
${UfEnum}
`


import {gql} from "@apollo/client"

import ActionMobile from './ActionMobile'
import MenuItemMobile from './MenuItemMobile'
import MenuItem from './MenuItem'
export default gql`

fragment ClientNotice on ClientNotice {
  actionsEmitMobile {
    ...ActionMobile
  }
  actionsMobile {
    ...MenuItemMobile
  }
  actionsWeb {
    ...MenuItem
  }
  body
  bodyHtml
  cls
  createdAt
  eventData
  eventGroup
  eventName
  haveBody
  id
  image
  isReaded
  message
  offerId
  showAs
  targetClientId
  targetCode
  targetUserId
  title
}
${ActionMobile}
${MenuItemMobile}
${MenuItem}
`

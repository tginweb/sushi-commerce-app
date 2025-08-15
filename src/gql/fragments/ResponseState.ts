
import {gql} from "@apollo/client"

import MenuItemMobile from './MenuItemMobile'
import MenuItem from './MenuItem'
import Message from './Message'
import ClientNotice from './ClientNotice'
export default gql`

fragment ResponseState on ResponseState {
  actionsMobile {
    ...MenuItemMobile
  }
  actionsWeb {
    ...MenuItem
  }
  events
  message {
    ...Message
  }
  messages {
    ...Message
  }
  notices {
    ...ClientNotice
  }
  rateLimitTtl
  redirect
  status
  success
}
${MenuItemMobile}
${MenuItem}
${Message}
${ClientNotice}
`

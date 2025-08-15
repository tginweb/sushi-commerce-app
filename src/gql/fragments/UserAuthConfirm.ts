
import {gql} from "@apollo/client"

import UserAuthConfirmStep from './UserAuthConfirmStep'
import MenuItemMobile from './MenuItemMobile'
import MenuItem from './MenuItem'
export default gql`

fragment UserAuthConfirm on UserAuthConfirm {
  CODE
  COLOR
  CONFIRM_CONTENT_MOBILE
  CONFIRM_CONTENT_WEB
  CONFIRM_STEPS {
    ...UserAuthConfirmStep
  }
  ICON
  LIST_BUTTON_MOBILE {
    ...MenuItemMobile
  }
  LIST_BUTTON_WEB {
    ...MenuItem
  }
  LIST_CAPTION
  LIST_NAME
  NAME
  RESEND_TITLE
}
${UserAuthConfirmStep}
${MenuItemMobile}
${MenuItem}
`

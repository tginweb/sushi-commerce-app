
import {gql} from "@apollo/client"

import UserAvatar from './UserAvatar'
export default gql`

fragment UserSafe on UserSafe {
  AVATAR {
    ...UserAvatar
  }
  ID
  NAME
  NAME_FULL
}
${UserAvatar}
`

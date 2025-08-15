
import {gql} from "@apollo/client"

import UserAvatar from './UserAvatar'
import UserFamily from './UserFamily'
import UserGroup from './UserGroup'
import Image from './Image'
import EntityProp from './EntityProp'
export default gql`

fragment User on User {
  ACTIONS
  AVATAR {
    ...UserAvatar
  }
  EMAIL
  FAMILY {
    ...UserFamily
  }
  GREETING_NAME
  GROUPS_INFO {
    ...UserGroup
  }
  ID
  LAST_NAME
  LOGIN
  LOGIN_FORMAT
  NAME
  NAME_FULL
  NAME_TEASER
  PERSONAL_BIRTHDAY
  PERSONAL_PHOTO {
    ...Image
  }
  PERSON_TYPE_ID
  PHONE
  PHONE_FORMATTED
  PROFILE_FILLED
  PROFILE_GIFT_USED
  PROMOCODE
  PROPS {
    ...EntityProp
  }
  ROLES
  SECOND_NAME
  SESSION_ID
}
${UserAvatar}
${UserFamily}
${UserGroup}
${Image}
${EntityProp}
`

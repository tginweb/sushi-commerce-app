
import {gql} from "@apollo/client"

import OrderPropOption from './OrderPropOption'
export default gql`

fragment OrderProp on OrderProp {
  CODE
  COMPONENT_NAMES
  DEFAULT_VALUE
  DESC
  GROUP_ID
  ID
  IS_PROFILE
  IS_PROFILE_NAME
  IS_READONLY
  IS_REQUIRED
  IS_UTIL
  NAME
  OPTIONS {
    ...OrderPropOption
  }
  PARAMS
  PERSON_TYPE_ID
  PROFILE_TEASER_HIDE
  ROLE
  SORT
  TYPE
}
${OrderPropOption}
`


import {gql} from "@apollo/client"

import ResponseState from './ResponseState'
export default gql`

fragment main_admin_iblock_element_set_active on main_admin_iblock_element_set_active {
  payload
  state {
    ...ResponseState
  }
}
${ResponseState}
`

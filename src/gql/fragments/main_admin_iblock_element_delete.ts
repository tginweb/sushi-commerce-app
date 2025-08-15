
import {gql} from "@apollo/client"

import ResponseState from './ResponseState'
export default gql`

fragment main_admin_iblock_element_delete on main_admin_iblock_element_delete {
  payload
  state {
    ...ResponseState
  }
}
${ResponseState}
`

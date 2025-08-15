
import {gql} from "@apollo/client"

import ResponseState from './ResponseState'
export default gql`

fragment sale_pub_fav_remove on sale_pub_fav_remove {
  payload
  state {
    ...ResponseState
  }
}
${ResponseState}
`

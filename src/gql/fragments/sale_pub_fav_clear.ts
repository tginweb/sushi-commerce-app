
import {gql} from "@apollo/client"

import ResponseState from './ResponseState'
export default gql`

fragment sale_pub_fav_clear on sale_pub_fav_clear {
  state {
    ...ResponseState
  }
}
${ResponseState}
`

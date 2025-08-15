
import {gql} from "@apollo/client"

import FavItem from './FavItem'
import ResponseState from './ResponseState'
export default gql`

fragment sale_pub_fav_add on sale_pub_fav_add {
  payload {
    ...FavItem
  }
  state {
    ...ResponseState
  }
}
${FavItem}
${ResponseState}
`

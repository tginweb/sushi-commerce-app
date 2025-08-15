
import {gql} from "@apollo/client"

import ActionMobile from './ActionMobile'
import ActionWeb from './ActionWeb'
import Order from './Order'
export default gql`

fragment OrderPayOnlinePayload on OrderPayOnlinePayload {
  actionMobile {
    ...ActionMobile
  }
  actionWeb {
    ...ActionWeb
  }
  order {
    ...Order
  }
}
${ActionMobile}
${ActionWeb}
${Order}
`

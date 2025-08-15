
import {gql} from "@apollo/client"

import ResponseState from './ResponseState'
export default gql`

fragment CaptchaVerify on CaptchaVerify {
  id
  reload
  state {
    ...ResponseState
  }
}
${ResponseState}
`

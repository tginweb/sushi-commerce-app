
import {gql} from "@apollo/client"

import CaptchaModel from './CaptchaModel'
import ResponseState from './ResponseState'
export default gql`

fragment MutationLoginRequest on MutationLoginRequest {
  captcha {
    ...CaptchaModel
  }
  id
  sid
  state {
    ...ResponseState
  }
}
${CaptchaModel}
${ResponseState}
`

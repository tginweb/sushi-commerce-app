
import {gql} from "@apollo/client"


export default gql`

fragment CaptchaModel on CaptchaModel {
  ACTIONS
  DATA
  ID
  PROVIDER
  SID
}

`

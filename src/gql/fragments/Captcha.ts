
import {gql} from "@apollo/client"


export default gql`

fragment Captcha on Captcha {
  ACTIONS
  DATA
  ID
  PROVIDER
  SID
}

`

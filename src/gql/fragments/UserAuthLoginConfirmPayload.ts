
import {gql} from "@apollo/client"


export default gql`

fragment UserAuthLoginConfirmPayload on UserAuthLoginConfirmPayload {
  redirect
  sessionId
  token
  userId
}

`


import {gql} from "@apollo/client"


export default gql`

fragment UserSession on UserSession {
  FUSER_ID
  SESSION_ID
  USER_ID
}

`

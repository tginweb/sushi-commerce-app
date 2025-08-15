
import {gql} from "@apollo/client"


export default gql`

fragment UserAuthLoginRequestPayload on UserAuthLoginRequestPayload {
  sid
  transportType
}

`

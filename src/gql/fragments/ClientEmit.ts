
import {gql} from "@apollo/client"


export default gql`

fragment ClientEmit on ClientEmit {
  body
  cls
  createdAt
  eventData
  eventGroup
  eventName
  id
  message
  targetClientId
  targetUserId
  title
}

`

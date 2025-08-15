
import {gql} from "@apollo/client"

import User from './User'
export default gql`

fragment Paycard on Paycard {
  ACTIONS
  DATE_CREATE
  DEFAULT
  ID
  NAME
  TITLE
  USER {
    ...User
  }
  USER_ID
  VALUE
}
${User}
`

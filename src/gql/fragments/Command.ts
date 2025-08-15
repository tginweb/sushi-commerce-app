
import {gql} from "@apollo/client"


export default gql`

fragment Command on Command {
  code
  confirm
  params
  path
  type
}

`

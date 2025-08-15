
import {gql} from "@apollo/client"


export default gql`

fragment Message on Message {
  category
  code
  data
  id
  message
  name
  notify
  rel
  type
}

`

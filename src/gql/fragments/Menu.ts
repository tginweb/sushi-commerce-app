
import {gql} from "@apollo/client"

import MenuItem from './MenuItem'
export default gql`

fragment Menu on Menu {
  children {
    ...MenuItem
  }
  code
  id
}
${MenuItem}
`

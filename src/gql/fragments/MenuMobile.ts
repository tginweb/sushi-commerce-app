
import {gql} from "@apollo/client"

import MenuItemMobile from './MenuItemMobile'
export default gql`

fragment MenuMobile on MenuMobile {
  children {
    ...MenuItemMobile
  }
  code
  id
}
${MenuItemMobile}
`

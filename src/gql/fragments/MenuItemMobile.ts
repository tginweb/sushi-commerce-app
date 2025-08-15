
import {gql} from "@apollo/client"

import ActionMobile from './ActionMobile'
import Condition from './Condition'
import Image from './Image'
export default gql`

fragment MenuItemMobile on MenuItemMobile {
  action {
    ...ActionMobile
  }
  backgroundColor
  badge
  color
  condition {
    ...Condition
  }
  icon
  id
  image {
    ...Image
  }
  imageId
  label
  labelColor
  link
  outline
  outlineColor
  outlineWidth
  params
  parent
  roles
  templatable
  templatableProps
}
${ActionMobile}
${Condition}
${Image}
`


import {gql} from "@apollo/client"

import Command from './Command'
import Image from './Image'
export default gql`

fragment MenuItem on MenuItem {
  badge
  bgColor
  blank
  color
  command {
    ...Command
  }
  display
  entityId
  entityType
  icon
  id
  image {
    ...Image
  }
  imageId
  infoLabel
  label
  native
  params
  parent
  roles
  url
}
${Command}
${Image}
`

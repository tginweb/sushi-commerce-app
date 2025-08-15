
import {gql} from "@apollo/client"

import ConstructorElement from './ConstructorElement'
export default gql`

fragment ConstructorBuildItem on ConstructorBuildItem {
  ELEMENT {
    ...ConstructorElement
  }
  ELEMENT_ID
  QUANTITY
}
${ConstructorElement}
`

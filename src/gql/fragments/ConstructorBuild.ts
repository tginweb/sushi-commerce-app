
import {gql} from "@apollo/client"

import ConstructorBuildItem from './ConstructorBuildItem'
export default gql`

fragment ConstructorBuild on ConstructorBuild {
  CONSTRUCTOR_CODE
  CONSTRUCTOR_URL
  SOSTAV {
    ...ConstructorBuildItem
  }
}
${ConstructorBuildItem}
`

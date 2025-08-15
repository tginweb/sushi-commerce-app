
import {gql} from "@apollo/client"


export default gql`

fragment UfEnum on UfEnum {
  CODE
  ID
  NAME
  SORT
  VALUE
}

`

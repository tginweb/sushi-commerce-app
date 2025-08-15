
import {gql} from "@apollo/client"


export default gql`

fragment OrderPropOption on OrderPropOption {
  DESCRIPTION
  ICON
  ID
  NAME
  SORT
  VALUE
  XML_ID
}

`

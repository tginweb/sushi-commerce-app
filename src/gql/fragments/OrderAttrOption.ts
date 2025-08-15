
import {gql} from "@apollo/client"


export default gql`

fragment OrderAttrOption on OrderAttrOption {
  DESCRIPTION
  ICON
  ID
  NAME
  NAME_SHORT
  SORT
  VALUE
  XML_ID
}

`

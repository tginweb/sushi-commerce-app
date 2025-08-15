
import {gql} from "@apollo/client"


export default gql`

fragment BasketItemProp on BasketItemProp {
  CODE
  NAME
  VALUE
  XML_ID
}

`

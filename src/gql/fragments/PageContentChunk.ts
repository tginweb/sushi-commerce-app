
import {gql} from "@apollo/client"


export default gql`

fragment PageContentChunk on PageContentChunk {
  CODE
  GROUP
  NAME
  TYPE
  VALUE
}

`

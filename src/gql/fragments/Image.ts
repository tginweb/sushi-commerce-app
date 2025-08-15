
import {gql} from "@apollo/client"


export default gql`

fragment Image on Image {
  FILE_SIZE
  ID
  ORIGINAL_NAME
  SRC
  SRC_DEFAULT
}

`

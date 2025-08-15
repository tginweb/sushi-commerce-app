
import {gql} from "@apollo/client"


export default gql`

fragment CommandMobile on CommandMobile {
  code
  confirm
  params
  path
  type
}

`


import {gql} from "@apollo/client"


export default gql`

fragment SaleDepartment on SaleDepartment {
  ACTIONS
  ADDRESS
  ID
  NAME
  SERVICE_ID
}

`

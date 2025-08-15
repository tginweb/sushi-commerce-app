
import {gql} from "@apollo/client"


export default gql`

fragment Paysystem on Paysystem {
  CODE
  DESCRIPTION
  ID
  IS_BILL
  IS_INNER
  IS_ONLINE
  IS_ONLINE_DELAYED
  NAME
}

`

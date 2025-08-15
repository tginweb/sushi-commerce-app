
import {gql} from "@apollo/client"

import ResponseState from './ResponseState'
export default gql`

fragment VacancyOrderAdd on VacancyOrderAdd {
  payload
  state {
    ...ResponseState
  }
}
${ResponseState}
`


import {gql} from "@apollo/client"

import QueryInfo from './QueryInfo'
import CompanyContact from './CompanyContact'
export default gql`

fragment CompanyContactConnection on CompanyContactConnection {
  info {
    ...QueryInfo
  }
  nodes {
    ...CompanyContact
  }
}
${QueryInfo}
${CompanyContact}
`

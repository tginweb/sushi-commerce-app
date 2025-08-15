
import {gql} from "@apollo/client"

import QueryInfo from './QueryInfo'
import CompanyOffice from './CompanyOffice'
export default gql`

fragment CompanyOfficeConnection on CompanyOfficeConnection {
  info {
    ...QueryInfo
  }
  nodes {
    ...CompanyOffice
  }
}
${QueryInfo}
${CompanyOffice}
`

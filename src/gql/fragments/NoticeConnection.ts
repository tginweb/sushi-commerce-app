
import {gql} from "@apollo/client"

import QueryInfo from './QueryInfo'
import Notice from './Notice'
export default gql`

fragment NoticeConnection on NoticeConnection {
  info {
    ...QueryInfo
  }
  nodes {
    ...Notice
  }
}
${QueryInfo}
${Notice}
`

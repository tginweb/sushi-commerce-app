
import {gql} from "@apollo/client"

import QueryInfo from './QueryInfo'
import Webcam from './Webcam'
export default gql`

fragment WebcamConnection on WebcamConnection {
  info {
    ...QueryInfo
  }
  nodes {
    ...Webcam
  }
}
${QueryInfo}
${Webcam}
`

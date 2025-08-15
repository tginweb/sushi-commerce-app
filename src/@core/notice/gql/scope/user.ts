import {gql} from "@apollo/client"
import ClientNoticeFragment from "~gql/fragments/ClientNotice"

export default gql`
    query {
        notice__notices: notice_pub_list {
            ...ClientNotice
        }
    }
    ${ClientNoticeFragment}
`


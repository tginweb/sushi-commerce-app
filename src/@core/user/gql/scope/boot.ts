import {gql} from "@apollo/client"
import UserSession from "~gql/fragments/UserSession"

export default gql`
    query {
        user__session: user_session {
            ...UserSession
        }
    }
    ${UserSession}
`


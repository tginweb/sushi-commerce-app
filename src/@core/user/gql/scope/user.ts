import {gql} from "@apollo/client"
import User from "~gql/fragments/User"

export default gql`
    query {
        user__user: user_fetch {
            ...User
        }
    }
    ${User}
`

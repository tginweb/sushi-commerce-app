import {gql} from "@apollo/client"
import ResponseState from "~gql/fragments/ResponseState"

export default gql`
    mutation(
        $id: Int
    ) {
        res: sale_pub_profile_delete(
            id: $id
        ) {
            state {
                ...ResponseState
            }
        }
    }
    ${ResponseState}
`

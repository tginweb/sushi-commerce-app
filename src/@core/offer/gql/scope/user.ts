import {gql} from "@apollo/client"
import Offer from "../fragment/Offer"

export default gql`
    query {
        offer__userList: offer_pub_user_list {
            ...Offer
        }
    }
    ${Offer}
`


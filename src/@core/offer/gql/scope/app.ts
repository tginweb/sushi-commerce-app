import {gql} from "@apollo/client"
import Offer from "../fragment/Offer"

export default gql`
    query {
        offer__commonList: offer_pub_common_list {
            ...Offer
        }
    }
    ${Offer}
`


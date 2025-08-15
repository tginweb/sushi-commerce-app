import {gql} from "@apollo/client"
import Offer from "~gql/fragments/Offer"

export default gql`
    query {
        res: offer_pub_user_list {
           ...Offer 
        }
    }
    ${Offer}
`

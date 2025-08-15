import {gql} from "@apollo/client"
import SaleClientCard from "~gql/fragments/SaleClientCard"

export default gql`
    query {
        sale__clientCard: sale_pub_client_card_fetch(isScope: true) {
            ...SaleClientCard
        }
    }
    ${SaleClientCard}
`


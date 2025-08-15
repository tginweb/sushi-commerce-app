import {gql} from "@apollo/client"

import ServiceOrder from "../fragment/ServiceOrder"

export default gql`
    query {
        res: sale_pub_service_order_list{
            ...ServiceOrder
        }
    }
    ${ServiceOrder}
`

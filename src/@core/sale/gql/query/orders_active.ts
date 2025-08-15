import {gql} from "@apollo/client"

import Order from "../fragment/Order"

export default gql`
    query {
        res: sale_pub_order_active_list{
            ...Order
        }
    }
    ${Order}
`

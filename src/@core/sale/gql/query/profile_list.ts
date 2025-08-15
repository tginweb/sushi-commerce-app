import {gql} from "@apollo/client"

import OrderProfile from "../fragment/OrderProfile"

export default gql`
    query { 
        res: sale_pub_profile_list{
            ...OrderProfile
        }
    }
    ${OrderProfile}
`

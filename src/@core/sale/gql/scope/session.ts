import {gql} from "@apollo/client"
import FavItem from "../fragment/FavItem"
import Vorder from "../fragment/Vorder"
import ProductElement from "@core/catalog/gql/fragments/ProductElement"
import OrderProfile from "../fragment/OrderProfile"
import Order from "../fragment/Order"

export default gql`
    query(
        $withVorderBasket: Boolean = true,
        $withVorderForm: Boolean = true,
        $withVorderOrder: Boolean = true
    ) {
        sale__profiles: sale_pub_profile_list {
            ...OrderProfile
        }
        sale__ordersActive: sale_pub_order_active_list {
            ...Order
        }
        fav__favs: sale_pub_fav_state {
            ...FavItem
        }
        vorder__basketProducts: sale_pub_vorder_basket_products {
            ...ProductElement
        }
        vorder__vorder: sale_pub_vorder(check: true) {
            ...Vorder
        }
    }
    ${OrderProfile}
    ${FavItem}
    ${Vorder}
    ${ProductElement}
    ${Order}
`

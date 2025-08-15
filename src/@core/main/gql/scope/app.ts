import {gql} from "@apollo/client"
import MenuMobile from "~gql/fragments/MenuMobile"

export default gql`
    query {
        menu__menus: menu_mobile_menus {
            ...MenuMobile
        }
    }
    ${MenuMobile}
`


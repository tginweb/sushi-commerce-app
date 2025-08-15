import {gql} from "@apollo/client"

import OrderAttr from "~gql/fragments/OrderAttr"
import ElementTeaserInline from "@core/main/gql/inline/ElementTeaser";

export default gql`
    fragment OrderProfile on OrderProfile {
        ID
        NAME
        IS_DEFAULT
        CAPTION
        USER_ID
        PERSON_TYPE_ID
        PERSON_TYPE {
            ID
            NAME
            IS_COMPANY
        }
        COMPANY_ID
        COMPANY {
            ${ElementTeaserInline}
        }
        ATTRS {
            ...OrderAttr
        }
        DELIVERY_FREE_FROM_PRICE
    }
    ${OrderAttr}
`


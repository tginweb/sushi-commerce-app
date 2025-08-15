import {gql} from "@apollo/client"
import MenuItemMobileFragment from "~gql/fragments/MenuItemMobile";

export default gql`
    fragment FaqElement on FaqElement {
        ID
        ACTIVE
        ACTIVE_FROM(format: "default")
        IBLOCK_SECTION_ID
        CODE
        NAME
        URL
        PREVIEW_TEXT
        DETAIL_TEXT
        ACTIONS_MOBILE {
            ...MenuItemMobile
        }
    }
    ${MenuItemMobileFragment}
`

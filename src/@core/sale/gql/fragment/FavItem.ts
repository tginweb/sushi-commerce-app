import {gql} from "@apollo/client"

export default gql`
    fragment FavItem on FavItem {
        ID
        NAME
        PRODUCT_ID
        INPUT_PROPS_HASH
    }
`


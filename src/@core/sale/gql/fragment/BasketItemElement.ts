import {gql} from "@apollo/client"
import Image from "~gql/fragments/Image"

export default gql`
    fragment BasketItemElement on ProductElement {
        ID
        NAME
        URL
        WEIGHT
        LIST_IMAGE {
            ...Image
        }
    }
    ${Image}
`



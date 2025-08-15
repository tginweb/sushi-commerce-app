import {gql} from "@apollo/client"
import SpecialOfferType from "~gql/fragments/SpecialOfferType"

export default gql`
    fragment SpecialOffer on SpecialOffer {
        ELEMENT_ID
        MODE
        TYPE
        TYPE_INFO {
            ...SpecialOfferType
        }
    }
    ${SpecialOfferType}
`



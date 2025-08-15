import {gql} from "@apollo/client";
import BasketItem from "./BasketItem";
import SpecialOffer from "./SpecialOffer";

export default gql`
    fragment Basket on Basket {
        TS
        SYNCED
        HASH
        PRICE
        MIN_PRICE
        MIN_PRICE_REACHED
        COUNT
        QUANTITY
        WEIGHT
        ITEMS {
            ...BasketItemApp
        }
        OFFERS {
            ...SpecialOffer
        }
    }
    ${BasketItem}
    ${SpecialOffer}
`


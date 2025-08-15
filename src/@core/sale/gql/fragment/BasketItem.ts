import {gql} from "@apollo/client"
import BasketItem from "~gql/fragments/BasketItem"
//import BasketItemElement from "./BasketItemElement";

export default gql`
    fragment BasketItemApp on BasketItem {
        ...BasketItem
    }
    ${BasketItem}
`



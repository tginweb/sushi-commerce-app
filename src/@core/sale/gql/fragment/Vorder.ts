import {gql} from "@apollo/client"

import VorderForm from "./VorderForm"
import Basket from "./Basket"
import VorderOrder from "./VorderOrder"

export type VOrderLocalArgs = {
    withVorderForm?: boolean,
    withVorderBasket?: boolean,
    withVorderOrder?: boolean,
}

export default gql`
    fragment Vorder on Vorder {
        ID
        PHONE
        EMAIL
        FORM @include(if: $withVorderForm) {
            ...VorderForm
        }
        BASKET @include(if: $withVorderBasket) {
            ...Basket
        }
        ORDER @include(if: $withVorderOrder) {
            ...VorderOrder
        }
    }
    ${VorderForm}
    ${VorderOrder}
    ${Basket}
`


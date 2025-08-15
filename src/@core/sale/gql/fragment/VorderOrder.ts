import {gql} from "@apollo/client"

export default gql`
    fragment VorderOrder on Order {
        TS
        SYNCED
        BONUSES
        PRICE
        PRICE_BASKET
        PRICE_BASKET_BASE
        PRICE_DISCOUNT 
        PRICE_DELIVERY
        PRICE_DELIVERY_BASE
        PRICE_TOTAL
        PRICE_TOTAL_BASE
        PRICE_PAY
        PRICE_PAY_BASE
        DISCOUNT_PERCENT
        DISCOUNT_REASON
        DELIVERY_FREE_FROM_PRICE
    }
`





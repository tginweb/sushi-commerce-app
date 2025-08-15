import {gql} from "@apollo/client"

import MenuItemMobile from '~gql/fragments/MenuItemMobile'
import Image from '~gql/fragments/Image'
import OfferSlide from '~gql/fragments/OfferSlide'

export default gql`
    fragment Offer on Offer {
        ID
        NAME
        DISCOUNT_ID
        CODE
        DETAIL_TEXT
        PREVIEW_TEXT
        BANNER_INTERNAL_TEXT
        BANNER_SQUARE {
            ...Image
        }
        BANNER_HOR_MOBILE {
            ...Image
        }
        VARS
        SLIDES {
            ...OfferSlide
        }
        ACTIONS_MOBILE {
            ...MenuItemMobile
        }
        IS_HOT
    }
    ${OfferSlide}
    ${MenuItemMobile}
    ${Image}

`


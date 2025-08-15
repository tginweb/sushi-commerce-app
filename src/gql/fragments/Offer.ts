
import {gql} from "@apollo/client"

import MenuItemMobile from './MenuItemMobile'
import MenuItem from './MenuItem'
import Image from './Image'
import OfferSlide from './OfferSlide'
export default gql`

fragment Offer on Offer {
  ACTIONS_MOBILE {
    ...MenuItemMobile
  }
  ACTIONS_WEB {
    ...MenuItem
  }
  ACTIVE_FROM
  BANNER_HOR_DESKTOP {
    ...Image
  }
  BANNER_HOR_MOBILE {
    ...Image
  }
  BANNER_INTERNAL_TEXT
  BANNER_SQUARE {
    ...Image
  }
  CODE
  CONTENT_IMAGE {
    ...Image
  }
  DETAIL_TEXT
  DISCOUNT_ID
  ID
  IS_HOT
  NAME
  OFFER_NAME
  PREVIEW_TEXT
  SLIDES {
    ...OfferSlide
  }
  STARTUP_SHOW
  VARS
  VID
  VIEW_MODE
}
${MenuItemMobile}
${MenuItem}
${Image}
${OfferSlide}
`


import {gql} from "@apollo/client"

import Image from './Image'
import ProductFlag from './ProductFlag'
import ProductGift from './ProductGift'
import ProductMeasure from './ProductMeasure'
import ElementMeta from './ElementMeta'
import ProductPrice from './ProductPrice'
import ElementProp from './ElementProp'
export default gql`

fragment ProductElement on ProductElement {
  ACTIONS
  ACTIVE
  ACTIVE_FROM
  ADDITIVES {
    ...ProductElement
  }
  ADMIN_URL
  AVAILABLE
  CODE
  CREATED
  DETAIL_IMAGE {
    ...Image
  }
  DETAIL_TEXT
  FLAGS {
    ...ProductFlag
  }
  GIFTS {
    ...ProductGift
  }
  IBLOCK_CODE
  IBLOCK_ID
  IBLOCK_SECTION_ID
  IBLOCK_SECTION_IDS
  ID
  IS_SALE_SPECIAL
  LIST_IMAGE {
    ...Image
  }
  MEASURE {
    ...ProductMeasure
  }
  META {
    ...ElementMeta
  }
  NAME
  NOT_AVAILABLE_REASON
  OFFER_PARENT_ELEMENT {
    ...ProductElement
  }
  PARENT {
    ...ProductElement
  }
  PREVIEW_TEXT
  PRICE {
    ...ProductPrice
  }
  PROPS {
    ...ElementProp
  }
  PROPS_VALUES {
    ...ElementProp
  }
  PROP_CHTO_PO_SOSTAVU
  PROP_DOPOLNITELNO
  PROP_DOSTAVKA
  PROP_FLAZHKI_ENUM_ID
  PROP_IS_FARM_XML_ID
  PROP_IS_NEW_XML_ID
  PROP_IZBRANNYE_TOVARY_XML_ID
  PROP_KAK_GOTOVIT
  PROP_MINIMALNYY_ZAKAZ
  PROP_MORE_PHOTO {
    ...Image
  }
  PROP_PRICE_OLD_1
  PROP_SEO_TEXT
  PROP_STRANA_PROISKHOZHDENIYA
  PROP_TOVAR_PO_AKTSII
  PROP_TOVAR_PO_AKTSII_XML_ID
  PROP_VES_UPAKOVKI_1
  RATING
  RATING_VOTES
  REQUIRED_MIN_PRICE
  SALES_COUNT
  SALE_TIME
  SORT
  SOSTAV_ROLLS_COUNT
  SOSTAV_ROLLS_IDS
  UPSALE_ELEMENTS
  UPSALE_SECTIONS
  URL
  WEIGHT
}
${Image}
${ProductFlag}
${ProductGift}
${ProductMeasure}
${ElementMeta}
${ProductPrice}
${ElementProp}
`

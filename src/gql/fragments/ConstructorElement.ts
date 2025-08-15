
import {gql} from "@apollo/client"

import ProductElement from './ProductElement'
import ConstructorBuild from './ConstructorBuild'
import Image from './Image'
import CatalogFav from './CatalogFav'
import ProductFlag from './ProductFlag'
import ProductGift from './ProductGift'
import ProductMeasure from './ProductMeasure'
import ElementMeta from './ElementMeta'
import ConstructorSection from './ConstructorSection'
import ProductPrice from './ProductPrice'
import ElementProp from './ElementProp'
import ProductTagElement from './ProductTagElement'
export default gql`

fragment ConstructorElement on ConstructorElement {
  ACTIONS
  ACTIVE
  ACTIVE_FROM
  ADDITIVES {
    ...ProductElement
  }
  ADMIN_URL
  AVAILABLE
  BUILD {
    ...ConstructorBuild
  }
  CODE
  CREATED
  DETAIL_IMAGE {
    ...Image
  }
  DETAIL_TEXT
  FAV {
    ...CatalogFav
  }
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
  OFFERS {
    ...ProductElement
  }
  OFFER_PARENT_ELEMENT {
    ...ProductElement
  }
  PARENT {
    ...ProductElement
  }
  PATH {
    ...ConstructorSection
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
  RATING
  RATING_VOTES
  REQUIRED_MIN_PRICE
  ROOT_SECTION {
    ...ConstructorSection
  }
  SALES_COUNT
  SALE_TIME
  SECTION {
    ...ConstructorSection
  }
  SECTIONS {
    ...ConstructorSection
  }
  SORT
  TAGS {
    ...ProductTagElement
  }
  UPSALE_ELEMENTS
  UPSALE_SECTIONS
  URL
  WEIGHT
}
${ProductElement}
${ConstructorBuild}
${Image}
${CatalogFav}
${ProductFlag}
${ProductGift}
${ProductMeasure}
${ElementMeta}
${ConstructorSection}
${ProductPrice}
${ElementProp}
${ProductTagElement}
`

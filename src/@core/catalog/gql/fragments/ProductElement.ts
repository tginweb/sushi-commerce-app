import {gql} from "@apollo/client"
import ElementProp from "@core/main/gql/fragment/ElementProp"
import ProductGift from "~gql/fragments/ProductGift"
import ProductFlag from "~gql/fragments/ProductFlag"
import ProductPrice from "~gql/fragments/ProductPrice"
import ProductMeasure from "~gql/fragments/ProductMeasure"
import Image from "~gql/fragments/Image"
import ElementTeaserInline from "@core/main/gql/inline/ElementTeaser";
import SectionTeaserInline from "@core/main/gql/inline/SectionTeaser";

export default gql`
    fragment ProductElement on ProductElement {
        ID
        CODE
        NAME
        URL
        IBLOCK_ID
        IBLOCK_SECTION_ID
        IBLOCK_SECTION_IDS
        PROPS {
            ...ElementProp
        }
        MEASURE {
            ...ProductMeasure
        }
        PRICE {
            ...ProductPrice
        }
        FLAGS {
            ...ProductFlag
        }
        TAGS {
            ${ElementTeaserInline}
        }
        SOSTAV_ROLLS_IDS
        SOSTAV_ROLLS_COUNT
        
        PREVIEW_TEXT
        DETAIL_TEXT
        LIST_IMAGE {
            ...Image
        }
        DETAIL_IMAGE {
            ...Image
        }
        SECTIONS {
            ${SectionTeaserInline}
        }
        GIFTS {
            ...ProductGift
        }
        BUILD {
            CONSTRUCTOR_CODE
            CONSTRUCTOR_URL
            SOSTAV {
                ELEMENT_ID
                QUANTITY
                ELEMENT {
                    ${ElementTeaserInline}
                    SECTION {
                        ${SectionTeaserInline}
                        IS_CORE
                    }
                }
            }
        }
        SALES_COUNT
        REQUIRED_MIN_PRICE
        UPSALE_ELEMENTS
        ACTIVE
    }
    ${ElementProp}
    ${ProductGift}
    ${ProductFlag}
    ${ProductPrice}
    ${ProductMeasure}
    ${Image}
`

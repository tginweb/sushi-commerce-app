import {gql} from "@apollo/client";
import EntityProp from "~gql/fragments/EntityProp"

export default gql`
    fragment ProductSectionBase on ProductSection {
        ID
        NAME
        CODE
        URL
        SORT
        ELEMENT_CNT
        IBLOCK_SECTION_ID
        PROPS {
            ...EntityProp
        }
        PICTURE {
            SRC
        }
        META {
            TITLE
            DESCRIPTION
            KEYWORDS
        }
    }
    ${EntityProp}
`


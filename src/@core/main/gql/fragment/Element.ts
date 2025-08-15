import {gql} from "@apollo/client"
import ElementProp from "./ElementProp"
import Image from "~gql/fragments/Image"

export default gql`
    fragment Element on Element {
        ID
        ACTIVE
        ACTIVE_FROM(format: "default")
        IBLOCK_SECTION_ID
        CODE
        NAME
        URL
        PREVIEW_TEXT
        LIST_IMAGE {
            ...Image
        }
        DETAIL_IMAGE {
            ...Image
        }
        DETAIL_TEXT
        PROPS(detail: true) {
            ...ElementProp
        }
    }
    ${Image}
    ${ElementProp}
`

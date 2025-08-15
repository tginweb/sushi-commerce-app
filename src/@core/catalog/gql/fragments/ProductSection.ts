import {gql} from "@apollo/client"

import ProductElement from "./ProductElement"
import ProductSectionBase from "./ProductSectionBase"

export default gql`

    fragment ProductSection on ProductSection {

        ...ProductSectionBase

        PARENT @include(if: $parentInclude) {

            ...ProductSectionBase

            CHILDREN @include(if: $parentChildrenInclude) {
                ...ProductSectionBase
            }
        }

        PARENTS @include(if: $parentsInclude) {
            ...ProductSectionBase
        }

        CHILDREN @include(if: $childrenInclude) {
            ...ProductSectionBase
            ELEMENTS (filter: $childrenElementsFilter, nav: $childrenElementsNav) @include(if: $childrenElementsInclude) {
                ...ProductElement
            }
        }

        ELEMENTS (filter: $elementsFilter, nav: $elementsNav) @include(if: $elementsInclude) {
            ...ProductElement
        }
    }
    ${ProductSectionBase}
    ${ProductElement}
`






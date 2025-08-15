import {gql} from "@apollo/client"
import ProductSectionBase from "../fragments/ProductSectionBase"
import ProductElement from "../fragments/ProductElement"

export default gql`
    query {
        catalog__sections: catalog_section_list(filter: {ACTIVE: "Y"}, nav: {limit: 1000}) {
            ...ProductSectionBase
        }
        catalog__products: catalog_product_list(nav: {limit: 1000}) {
            ...ProductElement
        }
        catalogConstructor__buildsBestseller: catalog_constructor_build_bestsellers(nav:{limit: 15}) {
            ...ProductElement
        }
        
        catalogConstructor__constructorProducts: catalog_product_list(filter: {IBLOCK_ID: 24}, nav: {limit: 1000}) {
            ...ProductElement
        }
        catalogConstructor__constructorSections: catalog_section_list(filter: {IBLOCK_ID: 24}, nav: {limit: 1000})  {
            ...ProductSectionBase
        }
      
    }
    ${ProductSectionBase}
    ${ProductElement}
`

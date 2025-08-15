import {gql} from "@apollo/client"
import PageElement from "../fragment/PageElement"

export default gql`
    query { 
        page__elements: page_element_list {
            ...PageElement
        }
    }
    ${PageElement}
`


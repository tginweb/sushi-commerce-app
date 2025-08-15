import {gql} from "@apollo/client"
import FaqElementFragment from "../fragment/Element"
import SectionTeaserInline from "@core/main/gql/inline/SectionTeaser";
import MenuItemMobileFragment from "~gql/fragments/MenuItemMobile";

export default gql`
    query {
        faq__elements: faq_element_list(nav: {limit:200}) {
            ...FaqElement
        }
        faq__sections: faq_sections {
            ${SectionTeaserInline}
        }
    }
    ${FaqElementFragment}
    ${MenuItemMobileFragment}
`

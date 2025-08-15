import {gql} from "@apollo/client"
import CompanyOffice from "../fragments/Office"
export default gql`
    query {
        company__offices: company_pub_office_list(filter: {ACTIVE: true}, nav: {limit:200}) {
            ...CompanyOffice
        }
    } 
    ${CompanyOffice}
`

import {gql} from "@apollo/client"
import Setting from "~gql/fragments/Setting"

export default gql`
    query {
        settings__settings: settings_list {
            ...Setting
        }
    }
    ${Setting}
`


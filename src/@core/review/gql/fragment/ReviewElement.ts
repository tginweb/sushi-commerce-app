import {gql} from "@apollo/client";

export default gql`
    fragment ReviewElement on ReviewElement {
        ID
        NAME
    }
`


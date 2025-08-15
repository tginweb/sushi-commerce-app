import {gql} from "@apollo/client"

export default gql`
    fragment PageElement on PageElement {
        ID
        NAME
        URL
        CODE
        DETAIL_TEXT
        DATA_CHUNKS {
            CODE
            TYPE
            VALUE
        } 
    }
`



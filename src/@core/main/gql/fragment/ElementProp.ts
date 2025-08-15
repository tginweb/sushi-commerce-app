import {gql} from "@apollo/client"

export default gql`
    fragment ElementProp on ElementProp {
        ID
        CODE
        NAME
        VAL
        VAL_ID
        VAL_ENUM_ID
        DESC
        MUL
        FILE {
            SRC
        }
        FILES {
            SRC
        }
    }
`

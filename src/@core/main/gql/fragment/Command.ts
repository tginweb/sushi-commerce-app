import {gql} from "@apollo/client"

export default gql`
    fragment Command on Command {
        code
        type
        path
        params
        confirm
    }
`

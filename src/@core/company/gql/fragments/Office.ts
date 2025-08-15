import {gql} from "@apollo/client"

export default gql`
    fragment CompanyOffice on CompanyOffice {
        ID
        NAME
        URL
        PROPS {
            CODE
            VAL
            FILES {
                SRC
            }
        }
        COORDS {
            LON
            LAT
        }
        ROLES
        WORKTIME
        DISTANCE
        DETAIL_IMAGE {
            SRC
        }
    }
`


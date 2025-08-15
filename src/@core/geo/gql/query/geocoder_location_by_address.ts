import {gql} from "@apollo/client"
import GeoObject from "~gql/fragments/GeoObject"

export default gql`
    query(
        $address: String
    ) {
        res: geo_geocoder_location_by_address(
            address: $address
        ) {
            ...GeoObject
        }
    }
    ${GeoObject}
`

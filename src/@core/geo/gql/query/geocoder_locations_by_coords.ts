import {gql} from "@apollo/client"
import GeoObject from "~gql/fragments/GeoObject"

export default gql`
    query(
        $lat: Float,
        $lon: Float
    ) {
        res: geo_geocoder_locations_by_coords(
            lat: $lat,
            lon: $lon
        ) {
            ...GeoObject
        }
    }
    ${GeoObject}
`

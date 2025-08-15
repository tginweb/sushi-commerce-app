
import {gql} from "@apollo/client"


export default gql`

fragment GeoObject on GeoObject {
  address_full
  address_original
  address_short
  area
  area_fias_id
  area_format
  area_original
  city
  city_fias_id
  city_format
  city_original
  district
  district_fias_id
  district_format
  district_original
  geo_lat
  geo_lon
  house
  house_fias_id
  house_format
  house_original
  region
  region_fias_id
  region_format
  region_original
  street
  street_fias_id
  street_format
  street_original
  street_path_full
  street_path_short
}

`

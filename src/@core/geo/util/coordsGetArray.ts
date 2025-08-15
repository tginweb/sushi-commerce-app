import {
    TGeoCoords,
    TGeoCoordsArray,
    TGeoCoordsDataLowerCase,
    TGeoCoordsDataUpperCase,
    TGeoCoordsDir
} from "@core/geo/types";
import {GeoCoordinates} from "@core/geo/class/GeoCoordinates";
import {TMaybe} from "@core/main/types";
import toInt from "@core/main/util/base/toInt";

export function coordsGetArray(coords: TGeoCoords, dir: TGeoCoordsDir = 'longlat'): TMaybe<TGeoCoordsArray> {
    if (!coords)
        return;
    if (coords instanceof GeoCoordinates) {
        coords.getArray(dir)
    } else if (Array.isArray(coords)) {
        return [toInt(coords[0]), toInt(coords[1])]
    } else if (typeof coords === 'object') {
        const coordsLowerCase = coords as TGeoCoordsDataLowerCase
        const coordsUpperCase = coords as TGeoCoordsDataUpperCase
        if (coordsLowerCase.lat) {
            return dir === 'longlat' ? [coordsLowerCase.lon, coordsLowerCase.lat] : [coordsLowerCase.lat, coordsLowerCase.lon]
        } else {
            return dir === 'longlat' ? [coordsUpperCase.LON, coordsUpperCase.LAT] : [coordsUpperCase.LON, coordsUpperCase.LON]
        }
    }
}

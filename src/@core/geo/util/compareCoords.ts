import {TGeoCoordsData} from "@core/geo/types";

export function compareCoords(coords1: TGeoCoordsData, coords2: TGeoCoordsData) {
    return JSON.stringify(coords1) === JSON.stringify(coords2)
}

import {Env, EnvClass} from "@core/main/lib/config/decorator"
import {TGeoCoordsData} from "@core/geo/types";

@EnvClass({})
export class GeoConfigSchema {
    @Env({server: true})
    GEO_DEFAULT_CENTER_COORDS: TGeoCoordsData = [104.32109, 52.28458]
}

export const GeoConfig = new GeoConfigSchema()
export default GeoConfig

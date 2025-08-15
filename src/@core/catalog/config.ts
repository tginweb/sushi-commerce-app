import {Env, EnvClass} from "@core/main/lib/config/decorator"

@EnvClass({})
export class CatalogConfigSchema {

    @Env({server: true})
    CATALOG_FRONT_SHOW_POPULAR_WIDGET: boolean = false

    @Env({server: true})
    CATALOG_FRONT_SHOW_POPULAR_TAB: boolean = false

    @Env({server: true})
    CATALOG_FRONT_SHOW_FAV_TAB: boolean = false

    @Env({server: true})
    CATALOG_SCREEN_URL = '/catalog/catalog'
}

export const CatalogConfig = new CatalogConfigSchema()
export default CatalogConfig

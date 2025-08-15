import {AppConfigSchema} from "@core/main/config"
import {SaleConfigSchema} from "@core/sale/config"

class appConfig {

}

export type TAppConfig = Partial<AppConfigSchema & SaleConfigSchema>




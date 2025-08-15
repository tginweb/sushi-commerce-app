import {Env, EnvClass} from "@core/main/lib/config/decorator"

@EnvClass()
export class SaleConfigSchema {
    @Env({writable: true})
    SALE_BASKET: string = 'BBB'

    @Env({writable: true})
    SALE_DELIVERY_FREE_FROM_PRICE: number = 800

    @Env({writable: true})
    SALE_RESERVE_MIN_TIME_COURIER: number = 30

    @Env({writable: true})
    SALE_RESERVE_MIN_TIME_PICKUP: number = 20

    @Env({server: true})
    SALE_VORDER_SCREEN_URL = '/sale/vorder'
}

export const SaleConfig = new SaleConfigSchema()
export default SaleConfig


import {Env, EnvClass} from "@core/main/lib/config/decorator"

@EnvClass({})
export class OfferConfigSchema {
    @Env({server: true})
    OFFER_VIEW_DIALOG_URL = '/offer/view/dialog'
}

export const OfferConfig = new OfferConfigSchema()
export default OfferConfig

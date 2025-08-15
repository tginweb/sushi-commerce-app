import {Env, EnvClass} from "@core/main/lib/config/decorator"

@EnvClass({})
export class CaptchaConfigSchema {
    @Env({server: true})
    CAPTCHA_URL: string = '/served/iframe/captcha.php'
}

export const CaptchaConfig = new CaptchaConfigSchema()
export default CaptchaConfig

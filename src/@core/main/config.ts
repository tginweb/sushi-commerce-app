import {Env, EnvClass} from "@core/main/lib/config/decorator"
import {TAppContact, TAppScreenData, TMenuAction} from "@core/main/types"
import {MixedStyleRecord} from "@native-html/transient-render-engine";
import {TFetchParams} from "@core/main/lib/graphql/client";

@EnvClass({})
export class AppConfigSchema {

    @Env({server: true})
    APP_SALT: string | null = null

    @Env({server: true})
    APP_SITE_URL: string = 'https://irkutsk.sushi-studio.ru'

    @Env({server: true})
    APP_SITE_PROD_URL: string = 'https://irkutsk.sushi-studio.ru'

    @Env()
    API_SERVER: string = ''

    @Env({server: true})
    API_GRAPHQL_URL: string = ''

    @Env()
    API_REST_URL: string = ''

    @Env()
    WEBSOCKET_URL_DEVICE: string = ''

    @Env()
    WEBSOCKET_URL: string = ''

    @Env({server: true})
    APP_DISABLE: boolean = false

    @Env({server: true})
    APP_DISABLE_INFO: TAppScreenData | null = null

    @Env({server: true})
    APP_NEED_UPDATE: boolean | 'required' = false

    @Env({server: true})
    APP_NEED_UPDATE_INFO: TAppScreenData | null = null


    @Env({server: true})
    APP_IOS_APPSTORE_URL: string = ''

    @Env({server: true})
    APP_ANDROID_GOOGLEPLAY_URL?: string

    @Env({server: true})
    APP_CONTACTS: TAppContact[] = []

    @Env({server: true})
    IMAGE_DEV_URLS: string[] = []

    @Env({server: true})
    IMAGE_BASE_URL: string = ''

    @Env({server: true})
    IMAGE_DEV_BASE_URL: string = ''

    @Env({server: true})
    IMAGE_STYLER_TEMPLATE: string = ''

    @Env({server: true})
    IMAGE_CACHE_LIMIT: number = 200

    @Env({server: true})
    HTML_STYLES: Record<string, MixedStyleRecord> = {}

    @Env({server: true})
    HTML_CLASSES: Record<string, MixedStyleRecord> = {}

    @Env({server: true})
    APP_FRONT_PAGE: string = '/catalog/catalog'

    @Env({server: true})
    GQL_QUERY_INFO: {
        mutation: Record<string, TFetchParams>,
        query: Record<string, TFetchParams>,
        patterns: {
            type?: 'mutation' | 'query',
            nameMatch?: string,
            fetchParams: TFetchParams
        }[]
    } = {
        mutation: {},
        query: {},
        patterns: []
    }

    @Env({server: true})
    SUPPORT_PHONE: string = '73952506130'

    @Env({server: true})
    AUTH_CONFIRM_OUTCALL_PHONE: string = '73952506130'

    @Env({server: true})
    APP_CONSENT_TITLE_1: string = 'Заполняя личные данные вы принимаете'

    @Env({server: true})
    APP_CONSENT_TITLE_2: string = 'Соглашение в отношении обработки персональных данных'

    @Env({server: true})
    APP_CONSENT_ACTION: TMenuAction = {
        url: 'webview-site://served/iframe/consent.php',
        title: 'Соглашение',
        titleAuto: true,
        addSession: true,
    }

    @Env({server: true})
    USER_EMAIL_NEED_CONFIRM: boolean = true

    @Env({server: true})
    TIMEZONE_OVERRIDE: string = ''
}

export const AppConfig = new AppConfigSchema()
export default AppConfig

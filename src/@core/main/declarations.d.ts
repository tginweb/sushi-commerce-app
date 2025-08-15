import {DebugStore} from "@core/main/store/debug";
import {SettingsStore} from "@core/main/store/settings";
import {MainStore} from "@core/main/store/main";
import {BusService} from "./service/bus";
import {ConfigService} from "./service/config";
import {CryptoService} from "./service/crypto";
import {DateService} from "./service/date";
import {GraphqlService} from "./service/graphql";
import {RestService} from "./service/rest";
import {UtilService} from "./service/util";
import {LinkingService} from "./service/linking";
import {HtmlService} from "@core/main/service/html";
import MenuStore from "@core/main/store/menu";
import PushStore from "@core/main/store/push";
import RouterStore from "@core/main/store/router";
import {WebsocketService} from "@core/main/service/websoket";

declare module "@core/main/types" {
    interface TAppStores {
        debug: DebugStore
        settings: SettingsStore
        main: MainStore
        menu: MenuStore
        push: PushStore,
        router: RouterStore,
    }
}

declare module "@core/main/types" {
    interface TAppServices {
        bus: BusService
        config: ConfigService
        websocket: WebsocketService
        crypto: CryptoService
        date: DateService
        graphql: GraphqlService
        rest: RestService
        util: UtilService
        linking: LinkingService
        html: HtmlService
    }
}


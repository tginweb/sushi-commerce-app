import AppConfig from "@core/main/config";
import {PlatformBase} from './base';
import Constants from "expo-constants";

export class IosPlatform extends PlatformBase {
    getCode() {
        return 'ios'
    }

    getAppMarketUrl() {
        return AppConfig.APP_IOS_APPSTORE_URL
    }

    getBuildVersionName() {
        return String(Constants.expoConfig?.ios?.buildNumber)
    }

    getAppVersion() {
        return Constants.expoConfig?.version
    }
}



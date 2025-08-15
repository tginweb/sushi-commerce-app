import AppConfig from "@core/main/config";
import {PlatformBase} from './base';
import Constants from "expo-constants";

export class AndroidPlatform extends PlatformBase {
    getCode() {
        return 'android'
    }

    getAppMarketUrl() {
        return AppConfig.APP_ANDROID_GOOGLEPLAY_URL || ''
    }

    getBuildVersionName() {
        return String(Constants.expoConfig?.android?.versionCode)
    }

    getAppVersion() {
        return Constants.expoConfig?.version
    }
}



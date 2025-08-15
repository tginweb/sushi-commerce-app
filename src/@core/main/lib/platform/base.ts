//import * as Application from "expo-application";

import Constants from "expo-constants";

export class PlatformBase {
    getNativeBuildVersion() {
       // return Application.nativeBuildVersion
    }

    getNativeApplicationVersion() {
       // return Application.nativeApplicationVersion
    }

    getBuildVersionName(): string {
        return ''
    }

    getAppVersion(): string | undefined {
        return ''
    }
}



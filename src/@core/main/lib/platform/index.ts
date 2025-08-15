import {Platform} from "react-native";
import {IosPlatform} from "@core/main/lib/platform/ios";
import {AndroidPlatform} from "@core/main/lib/platform/android";

export const platform = Platform.select({
    ios: new IosPlatform(),
    android: new AndroidPlatform(),
}) || new IosPlatform()

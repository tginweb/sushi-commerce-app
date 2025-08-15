import {usePathname} from "expo-router";
import AppConfig from "@core/main/config";

export function useFrontPagePath() {
    return AppConfig.APP_FRONT_PAGE
}

import {usePathname} from "expo-router";
import AppConfig from "@core/main/config";
import {useStores} from "~stores";

export function useIsCatalogPage() {
    const {router, catalog} = useStores()
    const currentUrl = router.getCurrentPath(usePathname())
    return currentUrl === AppConfig.APP_FRONT_PAGE
}

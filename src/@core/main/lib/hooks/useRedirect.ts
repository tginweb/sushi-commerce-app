import {useFocusEffect} from "expo-router";
import {useStores} from "~stores";
import {Href} from "@core/main/types";

export function useRedirect(route: Href, condition: () => boolean): void {

    const {router} = useStores()

    useFocusEffect(() => {
        if (router.goBackProcess) {
            router.back()
            return
        }
        if (condition()) {
            router.push(route)
        }
    })
}

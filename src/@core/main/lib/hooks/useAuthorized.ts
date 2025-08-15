import {useStores} from "~stores";
import {useFocusEffect, useRouter} from "expo-router";
import {useCallback} from "react";

export function useAuthorized(redirect = true): boolean {
    const {user, router: routerStore} = useStores()

    useFocusEffect(useCallback(() => {
        if (!redirect)
            return;
        if (!user.isAuthorized) {
            if (routerStore.goBackProcess) {
                routerStore.back()
                return
            }
            user.navLogin({
                redirect: 'current'
            })
        }
    }, [user.isAuthorized, redirect]))

    return user.isAuthorized && !!user.user
}

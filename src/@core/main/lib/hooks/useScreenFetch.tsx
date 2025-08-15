import {useFocusEffect, useLocalSearchParams, usePathname} from "expo-router";
import {useCallback} from "react";
import {useStores} from "~stores";

export function useScreenFetch(
    callback: any,
    params: {
        interval?: number,
        polling?: number | boolean,
        refetchParam?: string | boolean,
        refetchImmediate?: boolean
        refetchParamDelete?: boolean
    }
) {
    const {router} = useStores()
    const routeUrl = usePathname()
    const routeParams: any = useLocalSearchParams()

    useFocusEffect(
        useCallback(() => {

            if (params.refetchImmediate)
                callback()

            if (params.refetchParam) {

                const refetchParam = typeof params.refetchParam === 'string' ? params.refetchParam : 'refetch'

                if (routeParams[refetchParam]) {
                    callback()

                    if (params.refetchParamDelete) {
                        router.replace({
                            pathname: routeUrl,
                            params: {
                                routeParams,
                                refetch: null
                            }
                        })
                        return
                    }
                }
            }

            let interval: any

            if (params.polling) {
                callback.polling(params.polling)
            } else if (params.interval) {
                interval = setInterval(callback, params.interval)
            }

            return () => {
                interval && clearInterval(interval)
                if (params.polling) {
                    callback.polling()
                }
            }
        }, [params.refetchImmediate])
    )
}

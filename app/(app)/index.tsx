import React, {useRef} from 'react'
import {SafeAreaView} from 'react-native'
import {observer} from 'mobx-react'
import {useStores} from "~stores"
import {Href, TScreenProps} from "@core/main/types"
import {useFocusEffect, useRouter} from "expo-router"
import {UiLoading} from "~ui/loading";

export const MainScreen: React.FC<TScreenProps> = observer(({}) => {
    const router = useRouter();
    const {user, debug, sale} = useStores()

    const firstNav = useRef(true)


    useFocusEffect(() => {

        let href: Href | null

        if (firstNav.current) {

            firstNav.current = false

            if (debug.initialRoute && false) {
                href = debug.initialRoute
            } else {
                if (!user.isAuthorized) {
                    console.log('NOT AUTHED')
                    user.navLogin({
                        redirect: 'front',
                        checkAddress: true,
                    })
                } else {
                    user.setLoginFlow({
                        checkAddress: true,
                        redirect: 'front'
                    })
                    user.onLoginSuccess()
                }
                return
            }

        } else {
            console.log('SECODN')
            href = '/catalog/catalog'
        }

        console.log('href', href)
        router.push(href)
    })

    return (
        <SafeAreaView style={{flex: 1}}>
            <UiLoading
                preset={'fullscreen'}
                opacity={1}
            />
        </SafeAreaView>
    )
})

export default MainScreen

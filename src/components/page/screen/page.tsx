import React, {useEffect, useMemo, useState} from "react"
import {StyleSheet} from "react-native"
import {observer} from "mobx-react"
import {useStores} from "~stores"
import {TScreenProps} from "@core/main/types"
import {useFocusEffect, useLocalSearchParams, useNavigation} from "expo-router";
import {UiScreen} from "~ui/screen";
import {UiHtml} from "~ui/html";

export const PageScreen: React.FC<TScreenProps> = observer(() => {

    const {page} = useStores()
    const routeParams: any = useLocalSearchParams()
    const nav = useNavigation()

    const [visible, setVisible] = useState(false)

    const {
        code
    } = routeParams

    const pageElement = useMemo(() => {
        return page.pages.find(page => page.CODE === code)
    }, [code]);

    useFocusEffect(() => {
        setVisible(true)
        return () => {
            setVisible(false)
        }
    })

    useEffect(() => {
        
        if (visible && pageElement) {
            nav.setOptions({
                title: pageElement.NAME,
            })
        }
    }, [visible, pageElement])

    if (!pageElement)
        return <></>

    return <UiScreen
        preset={'default'}
        backgroundColor={'#FFFFFF'}
    >
        <UiHtml
            source={{html: pageElement.DETAIL_TEXT || ''}}
        />
    </UiScreen>
})

export default PageScreen

const styles = StyleSheet.create({

    section: {
        marginBottom: 17
    }
});

import React from 'react'
import {StyleSheet} from 'react-native'
import {observer, useLocalObservable} from 'mobx-react'
import {useServices} from '~services'
import {useStores} from '~stores'
import {TScreenProps} from "@core/main/types"
import {UiScreen} from "~ui/screen"
import {useAuthorized} from "@core/main/lib/hooks/useAuthorized";
import {UserBonusesCard} from "~com/user/cards/bonuses";
import {UserProfileCard} from "~com/user/cards/profile";
import {UserNoticesCard} from "~com/user/cards/notices";
import {UserProfileFillGiftCard} from "~com/user/cards/fill-gift";
import {UserMenuCard} from "~com/user/cards/menu";
import {UserLoginButtonCard} from "~com/user/cards/login-button";
import {ContentBuilder} from "~ui/content-builder/Builder";
import usePage from "@core/page/hooks/usePage";
import {UiContentBuilder} from "~ui/content-builder/BuilderRender";
import {UserActiveOrdersCard} from "~com/user/cards/active-orders";
import {useWatch} from "@core/main/lib/hooks/useWatch";
import {UserSideBoxCard} from "~com/user/cards/side-box";
import {useBottomSheetModal} from "~ui/bottom-sheet-vendor";
import {useFocusEffect} from "expo-router";
import {useNavigation} from "@react-navigation/native";

export const ProfileScreen: React.FC<TScreenProps> = observer(({route: any}) => {

    const {sale, faqDialog} = useStores()
    const {bus} = useServices()

    const bottomSheetModal = useBottomSheetModal();

    const {chunks, pageModel} = usePage<
        {
            options: {},
            layout: any,
        }
    >({
        path: '/user/profile',
        defaults: {
            options: {},
        },
    })


    const haveGuestData = sale.userOrdersActive.length || sale.userOrderProfiles.length

    const components = {
        profile: (p: any) => <UserProfileCard {...p} key={'profile'}/>,
        sideBox: (p: any) => <UserSideBoxCard {...p} key={'sideBox'} />,
        notices: (p: any) => <UserNoticesCard {...p} key={'notices'} />,
        bonuses: (p: any) => <UserBonusesCard {...p} key={'bonuses'}/>,
        ordersActive: (p: any) => <UserActiveOrdersCard {...p} key={'ordersActive'}/>,
        profileFillGift: (p: any) => <UserProfileFillGiftCard {...p} key={'profileFillGift'} />,
        menu: (p: any) => <UserMenuCard {...p} key={'menu'}/>,
        loginButton: (p: any) => <UserLoginButtonCard {...p} key={'loginButton'} />,
    }

    const layoutBuilder = useLocalObservable(() => new ContentBuilder({
        components,
        ...chunks.layout,
    }))

    const nav = useNavigation()

    useFocusEffect(() => {
        bottomSheetModal.dismissAll()
        nav.setOptions({
            headerBackRoute: '/catalog/catalog'
        })
    })

    useWatch(() => {
        layoutBuilder.setSchema(chunks.layout.schema)
    }, [chunks.layout.schema])

    const authorized = useAuthorized(!haveGuestData)

    if (!haveGuestData && !authorized) return <></>

    return (
        <UiScreen
            preset={'profile'}
        >
            <UiContentBuilder
                builder={layoutBuilder}
            />
        </UiScreen>
    )
})

const styles = StyleSheet.create({
    card: {}
})

export default ProfileScreen

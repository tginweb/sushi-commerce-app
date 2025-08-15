import {Tabs} from "expo-router"
import {AppNavTabbar} from '~com/app/layout/mobile/tabbar/tabbar'
import {TabsScreen} from '~ui/tabs-screen'

import ItemCart from "~com/app/layout/mobile/tabbar/item-cart"
import {nativeHeaderScreenOptions, screenOptions} from "~assets/config"

import React from "react"
import icons from "~assets/icons-map"

export const unstable_settings = {
    initialRouteName: '/catalog/catalog'
}

export default function AppLayout() {

    return <Tabs
        screenOptions={
            {
                ...nativeHeaderScreenOptions(),
                ...screenOptions(),
                tabBarHideOnKeyboard: true,
            }
        }
        sceneContainerStyle={{
            // backgroundColor: '#FF0000'
        }}
        backBehavior="history"
        tabBar={(props) => <AppNavTabbar {...props} />}
    >

        <TabsScreen
            name="index"
            // TODO: Type
            options={{
                title: 'Суши-Студио',
                tabBarVisible: false,
                // headerShown: false,
            }}
        />

        <TabsScreen
            name="catalog/catalog"
            // TODO: Type
            options={{
                title: 'Меню',
                tabBarIcon: icons.home,
                headerShown: false,
            }}
        />

        <TabsScreen
            name="catalog/search"
            // TODO: Type
            options={{
                title: 'Поиск',
                tabBarIcon: icons.search,
                headerShown: false
            }}
        />

        <TabsScreen
            name="sale/basket"
            options={{
                title: 'Корзина',
                headerShown: false,
                headerBackRoute: '/catalog/catalog',
                tabBarItem: (props) => <ItemCart key={props.index} {...props}/>,
            }}
        />

        <TabsScreen
            name="user"
            options={{
                title: 'Профиль',
                tabBarIcon: icons.profile,
                headerShown: false,
                badge: {
                    templatableProps: ['label', 'loading', 'visible'],
                    visible: '{store:notice:unreadedNoticesExists}',
                    label: '{store:notice:unreadedNoticesCount}',
                }
            }}
        />

        <TabsScreen
            name="info"
            options={{
                title: 'Инфо',
                tabBarIcon: icons.faq,
                headerShown: false,
            }}
        />

        <TabsScreen
            name="login"
            options={{
                title: 'Войти',
                tabBarVisible: false,
                tabBarHide: true,
                //headerShown: false,
            }}
        />

        <TabsScreen
            name="sale/address"
            options={{
                title: 'Адрес доставки',
                tabBarIcon: icons.search,
                tabBarVisible: false,
                tabBarHide: true,
                headerShown: false,
            }}
        />

    </Tabs>
}

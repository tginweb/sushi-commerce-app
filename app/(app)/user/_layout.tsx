import {Stack} from "expo-router"
import {nativeHeaderScreenOptions, screenOptions} from "~assets/config"
import React from "react"
import {StackScreen} from '~ui/stack-screen'

export default function Layout() {

    return (
        <Stack
            initialRouteName={'index'}
            screenOptions={{
                ...nativeHeaderScreenOptions(),
                ...screenOptions()
            }}

        >
            <StackScreen options={{title: 'Профиль'}} name="index"/>
            <StackScreen options={{title: "Изменить профиль"}} name="profile-edit"/>
            <StackScreen options={{title: "Бонусы"}} name="bonuses"/>
            <StackScreen options={{title: "История заказов"}} name="orders-history"/>
            <StackScreen options={{title: "Активные заказы"}} name="orders-active"/>
            <StackScreen options={{title: "Заказ"}} name="order"/>
        </Stack>
    )
}

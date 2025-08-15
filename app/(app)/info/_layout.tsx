import {Stack} from "expo-router"
import {nativeHeaderScreenOptions, screenOptions} from "~assets/config"
import React from "react"
import {StackScreen} from "~ui/stack-screen";

export default function Layout() {

    return (
        <Stack

            initialRouteName={'index'}
            screenOptions={{
                ...nativeHeaderScreenOptions(),
                ...screenOptions(),
            }}
        >
            <StackScreen options={{title: 'Информация'}} name="index"/>
            <StackScreen options={{title: 'Вопросы и ответы'}} name="faq"/>
            <StackScreen
                options={{title: 'Доставка', headerShown: false}}
                name="delivery"
            />
            <StackScreen options={{title: 'О приложении'}} name="app-info"/>
            <StackScreen options={{title: 'Обратная связь'}} name="feedback"/>
            <StackScreen options={{title: 'Новости'}} name="news"/>
            <StackScreen options={{title: 'Информация'}} name="page"/>
        </Stack>
    );
}

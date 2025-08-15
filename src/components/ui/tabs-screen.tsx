import React from "react"
import {Tabs} from "expo-router"
import {TBottomTabNavigationOptions} from "@core/ui/types";

const Screen = Tabs.Screen

type TProps = Omit<React.ComponentPropsWithoutRef<typeof Screen>, 'options'> & {
    options: TBottomTabNavigationOptions
}

export const TabsScreen = Tabs.Screen as React.FC<TProps>

import React from "react"
import {Stack} from "expo-router"
import {TNativeStackNavigationOptions} from "@core/ui/types";

const Screen = Stack.Screen

type TProps = Omit<React.ComponentPropsWithoutRef<typeof Screen>, 'options'> & {
    options: TNativeStackNavigationOptions
}

export const StackScreen = Stack.Screen as React.FC<TProps>

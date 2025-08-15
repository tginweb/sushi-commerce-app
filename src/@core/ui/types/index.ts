import ImageSizes from "@core/ui/data/image-sizes";
import {NativeScrollEvent} from "react-native";
import {
    BottomTabNavigationEventMap,
    BottomTabNavigationOptions,
    BottomTabNavigationProp
} from "@react-navigation/bottom-tabs/src/types";
import {UiBtnProps} from "~ui/btn";
import React from "react";
import {Descriptor, NavigationHelpers, ParamListBase, RouteProp, TabNavigationState} from "@react-navigation/native";
import {EdgeInsets} from "react-native-safe-area-context";
import {NavigationState, PartialState, Route} from "@react-navigation/routers/src/types";
import {NativeStackNavigationOptions} from "@react-navigation/native-stack";
import {UiBadgeProps} from "~ui/badge";

export type TAppLayoutTabbar = {
    height: number
    heightPrev: number
}

export type TAppLayoutHeader = {
    height: number
    heightPrev: number
}

export type TAppLayout = {
    tabbar: TAppLayoutTabbar
    header: TAppLayoutHeader
}

export type TImageSize = (keyof typeof ImageSizes) | 'w-1' | 'w-1-2' | 'w-1-3' | 'w-1-4' | number | string | [number, number, boolean?]

export type TConfirmProps = {
    title?: string
    message?: string
    okLabel?: string
    cancelLabel?: string
}

export type TScrollableChangeAction = {
    type: 'scroll',
    event: NativeScrollEvent
} | {
    type: 'resize',
    contentHeight?: number
}

export type TViewableImageState = {
    entityId: number
    entityName: string
    showtime: number,
    imageUrl: string,
    imageStatus: 'fetch' | 'process' | 'fetched'
}

export type TBottomTabDescriptor = Descriptor<
    TBottomTabNavigationOptions,
    BottomTabNavigationProp<ParamListBase>,
    RouteProp<ParamListBase>
>;

export type TBottomTabDescriptorMap = Record<string, TBottomTabDescriptor>;

export type TBottomTabNavigationOptions = BottomTabNavigationOptions & {
    title?: string
    headerBackRoute?: string | boolean
    tabBarHide?: boolean
    tabBarVisible?: boolean
    headerRightActions?: UiBtnProps[]
    tabBarItem?: React.FC<any>
    labelHide?: boolean
    bottomInformerHide?: boolean
    badge?: UiBadgeProps
}

export type TBottomTabBarProps = {
    state: TabNavigationState<ParamListBase>;
    descriptors: TBottomTabDescriptorMap;
    navigation: NavigationHelpers<ParamListBase, BottomTabNavigationEventMap>;
    insets: EdgeInsets;
};

export type TNavigationRoute = Route<Extract<any, string>, any> & {
    state?: NavigationState | PartialState<NavigationState>;
};


export type TNativeStackNavigationOptions = NativeStackNavigationOptions & {
    headerBackRoute?: string | boolean
    tabBarHide?: boolean
    tabBarVisible?: boolean
    headerRightActions?: UiBtnProps[]
    tabBarItem?: React.FC<any>
    labelHide?: boolean
    hideBottomInformer?: boolean
}

export type TStackScreenDescriptor = Descriptor<
    TNativeStackNavigationOptions,
    BottomTabNavigationProp<ParamListBase>,
    RouteProp<ParamListBase>
>;

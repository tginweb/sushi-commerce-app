import React, {FC, useCallback, useEffect, useMemo, useState} from "react"
import {Platform, StyleSheet} from "react-native"
import {Text, TouchableOpacity, View} from "react-native-ui-lib"
import {observer} from "mobx-react";

import {usePathname} from "expo-router"
import {useApp} from "@core/main/lib/hooks/useApp";
import Animated from "react-native-reanimated";
import {useDebounceCallback} from "@core/main/lib/hooks/useDebounceCallback";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {COLORS, TYPOGRAPHY} from "~assets/design";
import {TBottomTabBarProps, TNavigationRoute} from "@core/ui/types";
import {TMaybe} from "@core/main/types";
import {useStores} from "~stores";
import {useServices} from "~services";
import {UiBadge, UiBadgeProps} from "~ui/badge";

type AppNavTabbarItem = {
    title: string
    badge?: UiBadgeProps
    icon?: (props: {
        focused: boolean;
        color: string;
        size: number;
    }) => React.ReactNode
    component?: any
    route: TNavigationRoute
}

type AppNavTabbarComponentProps = {
    items: TMaybe<AppNavTabbarItem>[]
    activeIndex: number
    onNav: (item: AppNavTabbarItem) => void
    hidden: boolean
    bottomInset: number
}

const AppNavTabbarComponent: FC<AppNavTabbarComponentProps> = React.memo((props) => {

    const {
        items,
        onNav,
        bottomInset,
        activeIndex,
        hidden
    } = props

    const stores = useStores()

    const {ui} = useStores()

    const updateHeight = useDebounceCallback((height: number) => {
        ui.appLayoutTabbarHeightSet(height)
    }, 100)

    const onLayout = useCallback((event: any) => {
        let height = event.nativeEvent.layout.height
        updateHeight(height > 1 ? height : 0)
    }, [bottomInset])

    return <Animated.View
        style={[
            styles.wrapper,
            {
                paddingBottom: bottomInset
            },
            hidden && {
                height: 1,
                overflow: 'hidden',
                opacity: 0
            },
        ]}
        onLayout={onLayout}
    >
        <View style={styles.container} row centerV>

            {items.map((item, index) => {

                if (!item)
                    return;

                const focused = activeIndex === index

                const color = focused ? COLORS.primary : COLORS.grey20

                if (item.component)
                    return item.component({focused, color, index})


                return <TouchableOpacity
                    key={index}
                    onPress={() => onNav(item)}
                    style={[
                        styles.item,
                        focused && styles.itemActive
                    ]}
                    centerV
                >
                    <View style={styles.itemContent} centerH>
                        {!!item.badge &&
                            <UiBadge
                                style={styles.badgeCount}
                                backgroundColor={COLORS.primary}
                                size={16}
                                {...item.badge}
                            />
                        }
                        {item.icon && item.icon({size: 20, color} as any)}
                        <Text style={[
                            styles.itemLabel,
                            focused && styles.itemLabelActive,
                            {color}
                        ]}>
                            {item.title}
                        </Text>
                    </View>
                </TouchableOpacity>
            })}
        </View>
    </Animated.View>
})

export const AppNavTabbar: FC<TBottomTabBarProps> = observer((props) => {
    const {
        state,
        descriptors,
        navigation
    } = props

    const {bus} = useServices()

    const app = useApp()

    const [hidden, setHidden] = useState(false)
    const currentUrl = usePathname()
    const insets = useSafeAreaInsets()
    const bottomInset = insets.bottom

    if (!state || !state.routes) return <></>

    const route = state.routes[state.index]

    let {options: focusedOptions} = descriptors[route.key]

    if (route.state?.routes) {
        const stackRoute = route.state.routes[route.state.routes.length - 1]
        if (stackRoute && stackRoute.params) {
            focusedOptions = {
                ...focusedOptions,
                ...stackRoute.params
            }
        }
    }

    if (app.routeOptions[currentUrl]) {
        focusedOptions = {
            ...focusedOptions,
            ...app.routeOptions[currentUrl]
        }
    }

    const setHiddenDebounced = useDebounceCallback((state: boolean) => {
        setHidden(state)
    }, Platform.OS === 'ios' ? 800 : 50)

    const hide = focusedOptions.tabBarHide

    useEffect(() => {
        
        if (hide) {

            setHiddenDebounced(true)
        } else {
            setHiddenDebounced(false)
        }
    }, [hide])

    const items = useMemo(() => {
        return state.routes.map((route, index) => {
            const {options} = descriptors[route.key]
            if (options.tabBarVisible === false)
                return;
            const item: AppNavTabbarItem = {
                title: options.title ?? route.name,
                icon: options.tabBarIcon,
                component: options.tabBarItem,
                badge: options.badge,
                route
            }
            return item
        })
    }, [])

    const onNav = useCallback((item: AppNavTabbarItem) => {
        const {route} = item

        let event: any

        event = navigation.emit({
            type: 'tabPress' as any,
            target: route.key,
            canPreventDefault: true,
        })

        if (event.defaultPrevented)
            return;

        bus.emit('nav.emit', route, event)

        if (event.defaultPrevented)
            return;

        bus.emit('bus:router.beforeNav', route.name)

        navigation.navigate({
            name: route.name,
            merge: true,
            params: {}
        } as any)

        bus.emit('bus:router:afterNav', route.name)
    }, [])

    return <AppNavTabbarComponent
        items={items}
        activeIndex={state.index}
        onNav={onNav}
        bottomInset={bottomInset}
        hidden={hidden}
    />
})

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: '#f8f4f1',
    },
    informer: {},
    container: {
        flexDirection: 'row',
        paddingLeft: 10,
        paddingRight: 10,
        borderTopWidth: 1,
        borderColor: '#DDDDDD',
        alignItems: 'stretch',
    },
    item: {
        flex: 1,
        flexDirection: 'column',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
    },
    itemActive: {},
    itemHero: {
        marginTop: -20
    },
    itemIcon: {},
    itemLabel: {
        ...TYPOGRAPHY['text-4xs-lh0'],
    },
    itemLabelActive: {},
    itemContent: {
        gap: 4,
    },
    badgeCount: {
        position: 'absolute',
        right: 0,
        top: -5,
    },
})


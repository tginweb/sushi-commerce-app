import React, {ReactNode, useCallback, useMemo} from 'react';
import {StyleSheet} from 'react-native';
import {Route, SceneRendererProps} from "~ui/tab-view/types";
import {TabBar, TabbarProps} from "~ui/tab-view/TabBar";
import {TTabControllerItemProps} from "~ui/tabs";
import {SceneMap} from "~ui/tab-view/SceneMap";
import {TabView, TabViewProps} from "~ui/tab-view/TabView";

export type TabBarStandaloneProps<T extends Route> =
    Omit<TabbarProps<T>, 'navigationState' | 'layout' | 'position' | 'jumpTo'> &
    Pick<TabViewProps<T>, "initialLayout"> &
    {
        onIndexChange?: (index: number) => void;
        activeIndex: number
        items: TTabControllerItemProps[]
    }

export function TabBarStandalone<T extends Route>(props: TabBarStandaloneProps<T>) {

    const {
        items,
        activeIndex,
        style,
        tabStyle,
        labelStyle,
        activeColor,
        inactiveColor,
        indicatorStyle,
        scrollEnabled,
        onTabPress,
        onIndexChange,
        renderBadge,
        renderLabel,
        contentContainerStyle,
        ...rest
    } = props

    const routes = useMemo(() => {
        return items.map(item => ({
            ...item,
            key: item.value,
            title: item.label,
        }))
    }, [items])

    const scene = useMemo(() => {
        return SceneMap(items.reduce<Record<string, () => ReactNode>>((map, tab) => {
            map[tab.value] = () => <></>
            return map
        }, {}))
    }, [items])

    const tabbarRender = useCallback((p: SceneRendererProps & { navigationState: any }) => {
        return <TabBar
            contentContainerStyle={contentContainerStyle}
            onTabPress={onTabPress}
            scrollEnabled={scrollEnabled}
            tabStyle={tabStyle}
            labelStyle={labelStyle}
            activeColor={activeColor}
            inactiveColor={inactiveColor}
            indicatorStyle={indicatorStyle}
            style={style}
            renderBadge={renderBadge}
            renderLabel={renderLabel}
            {...p}
        />
    }, [
        onTabPress,
        scrollEnabled,
        tabStyle,
        labelStyle,
        activeColor,
        inactiveColor,
        contentContainerStyle,
        indicatorStyle,
        style
    ])

    const _onIndexChange = onIndexChange || ((index) => {
    })

    return <TabView
        tabBarOnly={true}
        renderTabBar={tabbarRender as any}
        renderScene={scene}
        navigationState={{index: activeIndex, routes}}
        onIndexChange={_onIndexChange}
        style={{
            flex: 0
        }}
        {...rest}
    />
}

const styles = StyleSheet.create({})

import _filter from "lodash/filter";
import _noop from "lodash/noop"; // TODO: support commented props
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {runOnJS, useAnimatedReaction, useSharedValue, withTiming} from 'react-native-reanimated';
import {Constants, Hooks} from "react-native-ui-lib";
import TabBarContext from "./TabBarContext";
import {TabControllerBarProps} from "./TabBar.types";
import {TabControllerItemProps} from "./TabBarItem.types";
import useImperativeTabControllerHandle from "./useImperativeTabControllerHandle";
import {TabControllerImperativeMethods} from "./useImperativeTabControllerHandle.types";
import {TabControllerProps} from "./index.types";

export {default as TabBar} from './TabBar';
export {default as TabBarItem} from './TabBarItem';
export {default as TabPage} from './TabPage';
export {default as PageCarousel} from './PageCarousel';
export {default as PageCarouselGesture} from './PageCarouselGesture';

const useOrientation = Hooks.useOrientation
const useThemeProps = Hooks.useThemeProps

export type {TabControllerBarProps, TabControllerItemProps, TabControllerImperativeMethods};

const getScreenWidth = (useSafeArea: any) => {
    const {
        left,
        right
    } = Constants.getSafeAreaInsets();
    return Constants.windowWidth - (useSafeArea && Constants.isIphoneX ? left + right : 0);
};

/**
 * @description: A performant solution for a tab controller with lazy load mechanism
 * @example: https://github.com/wix/react-native-ui-lib/blob/master/demo/src/screens/componentScreens/TabControllerScreen/index.tsx
 * @notes: This component is based on react-native-gesture-handler
 * @important: On Android, if using react-native-navigation, make sure to wrap your screen with gestureHandlerRootHOC
 * @importantLink: https://kmagiera.github.io/react-native-gesture-handler/docs/getting-started.html#with-wix-react-native-navigation-https-githubcom-wix-react-native-navigation
 */
export const TabController = React.forwardRef((props: TabControllerProps, ref) => {
    const themeProps = useThemeProps(props, 'TabController');
    const {
        initialIndex = 0,
        asCarousel = false,
        items,
        onChangeIndex = _noop,
        onBeforeChangeIndex,
        carouselPageWidth,
        useSafeArea = false,
        children
    } = themeProps;
    const [screenWidth, setScreenWidth] = useState(getScreenWidth(useSafeArea));
    if (items?.length < 2) {
        console.warn('TabController component expect a minimum of 2 items');
    }
    useOrientation({
        onOrientationChange: () => {
            setScreenWidth(getScreenWidth(useSafeArea));
        }
    });
    const pageWidth = useMemo(() => {
        return carouselPageWidth || screenWidth;
    }, [carouselPageWidth, screenWidth]);

    const [scrollYState, setScrollYState] = useState(-1000)

    const ignoredItems = useMemo(() => {
        return _filter(items, item => item.ignore);
    }, [items]);

    /* currentPage - static page index */
    const currentPage = useSharedValue(initialIndex);
    const currentScroll = useSharedValue(0);


    /* targetPage - transitioned page index (can be a fraction when transitioning between pages) */
    const targetPage = useSharedValue(initialIndex);
    const setCurrentIndex = useCallback((index: number) => {
        'worklet';

        currentPage.value = index;
    }, []);

    const setCurrentScroll = useCallback((y: number) => {
        //setScrollYState(y)
    }, [scrollYState]);

    useEffect(() => {
        setCurrentIndex(initialIndex);
    }, [initialIndex]);

    useAnimatedReaction(() => {
        return currentPage.value;
    }, (value, prevValue) => {
        if (value !== prevValue) {
            targetPage.value = withTiming(value);
            prevValue !== null && runOnJS(onChangeIndex)(value, prevValue);
        }
    });

    useImperativeTabControllerHandle(ref as any, setCurrentIndex, setCurrentScroll);
    const context = useMemo(() => {
        return {
            /* Pass Props */
            initialIndex,
            asCarousel,
            pageWidth,
            scrollYState,
            setScrollYState,
            /* Items */
            items,
            ignoredItems,
            itemsCount: items.length - ignoredItems.length,
            /* Animated Values */
            targetPage,
            currentPage,
            currentScroll,
            containerWidth: screenWidth,
            /* Callbacks */
            onChangeIndex,
            onBeforeChangeIndex,
            setCurrentIndex,
            setCurrentScroll
        };
    }, [initialIndex, asCarousel, items, onChangeIndex, screenWidth]);
    return <TabBarContext.Provider value={context}>{children}</TabBarContext.Provider>;
});


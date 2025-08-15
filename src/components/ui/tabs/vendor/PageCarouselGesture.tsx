import React, {useCallback, useContext, useEffect, useMemo} from 'react';
import TabBarContext from "./TabBarContext";
import {runOnJS, useAnimatedReaction, useAnimatedRef, useSharedValue} from 'react-native-reanimated';
import {Constants} from "react-native-ui-lib";
import {ScrollView} from "react-native-gesture-handler";
import {NativeScrollEvent, NativeSyntheticEvent, ScrollViewProps} from "react-native";

const FIX_RTL = Constants.isRTL && Constants.isAndroid;

/**
 * @description: TabController's Page Carousel
 * @example: https://github.com/wix/react-native-ui-lib/blob/master/demo/src/screens/componentScreens/TabControllerScreen/index.tsx
 * @notes: You must pass `asCarousel` flag to TabController and render your TabPages inside a PageCarousel
 */
function PageCarouselGesture(props: ScrollViewProps) {
    const {
        onMomentumScrollEnd,
        style,
        ...others
    } = props;
    const carousel = useAnimatedRef<any>();
    const {
        itemsCount,
        currentPage,
        currentScroll,
        targetPage,
        pageWidth,
        scrollYState,
        setScrollYState,
        onBeforeChangeIndex,
        // carouselOffset,
        setCurrentIndex
    } = useContext<any>(TabBarContext);
    const initialOffset = useMemo(() => ({
        x: currentPage.value * pageWidth,
        y: 0
    }), []);
    const indexChangeReason = useSharedValue<string | undefined>(undefined);
    const scrollToInitial = useCallback(() => {
        if (Constants.isAndroid && currentPage.value) {
            scrollToItem(currentPage.value);
        }
    }, []);
    const calcOffset = useCallback((offset: number) => {
        'worklet';

        return FIX_RTL ? pageWidth * (itemsCount - 1) - offset : offset;
    }, [pageWidth, itemsCount]);

    const onMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const xOffset = calcOffset(e.nativeEvent.contentOffset.x);
        const newPage = Math.round(xOffset / pageWidth);
        indexChangeReason.value = 'byScroll';
        setCurrentIndex(newPage);
    }

    const onMomentumBegin = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const xOffset = calcOffset(e.nativeEvent.contentOffset.x);
        const newPage = Math.round(xOffset / pageWidth);

        onBeforeChangeIndex && onBeforeChangeIndex(newPage)
        //indexChangeReason.value = 'byScroll';
        //setCurrentIndex(newPage);
    }

    const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const xOffset = calcOffset(e.nativeEvent.contentOffset.x);
        const newIndex = xOffset / pageWidth;
        if (indexChangeReason.value === 'byPress') {
            // Scroll was immediate and not by gesture
            /* Round is for android when offset value has fraction */
            // targetPage.value = withTiming(Math.round(newIndex));

            indexChangeReason.value = undefined;
        } else {
            targetPage.value = newIndex;
        }
    }

    const scrollToItem = useCallback((index: number) => {
        if (indexChangeReason.value === 'byScroll') {
            indexChangeReason.value = undefined;
        } else {
            indexChangeReason.value = 'byPress';
        }
        const actualIndex = FIX_RTL ? itemsCount - index - 1 : index;
        carousel.current?.scrollTo({
            x: actualIndex * pageWidth,
            animated: false
        });
    }, [pageWidth, itemsCount]);

    const scrollVertical = useCallback((index: number) => {
        carousel.current?.scrollTo({
            y: index,
            animated: true
        });
    }, []);

    useAnimatedReaction(() => {
        return currentPage.value;
    }, (currIndex, prevIndex) => {
        if (prevIndex !== null && currIndex !== prevIndex) {
            runOnJS(scrollToItem)(currIndex);
        }
    });

    useAnimatedReaction(() => {
        return currentScroll.value;
    }, (currScroll, prevScroll) => {
        //runOnJS(scrollVertical)(currScroll);
    });


    useAnimatedReaction(() => {
        return currentPage.value;
    }, (currIndex, prevIndex) => {
        if (prevIndex !== null && currIndex !== prevIndex) {
            runOnJS(scrollToItem)(currIndex);
        }
    });

    useEffect(() => {
        carousel.current?.scrollTo({
            x: currentPage.value * pageWidth,
            animated: false
        });
    }, [pageWidth]);

    useEffect(() => {
        if (scrollYState >= 0) {
            /*
            carousel.current?.scrollTo({
                y: scrollYState,
                animated: false
            });
            setScrollYState(-1000)

             */
        }
    }, [scrollYState])

    const handleOnMomentumScrollEnd = useCallback((event: any) => {
        onMomentumScrollEnd?.(event);
    }, [onMomentumScrollEnd]);
    const _style = useMemo(() => {
        return [{
            width: pageWidth
        }, style];
    }, [pageWidth, style]);
    return <ScrollView
        {...others}
        style={_style}
        ref={carousel}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        onMomentumScrollEnd={onMomentumEnd}
        onMomentumScrollBegin={onMomentumBegin}
        scrollEventThrottle={16}
        contentOffset={initialOffset} // iOS only
        onLayout={scrollToInitial} // Android only
        //onMomentumScrollEnd={handleOnMomentumScrollEnd} // TODO: workaround for useAnimatedScrollHandler.onMomentumEnd not being called (https://github.com/software-mansion/react-native-reanimated/issues/2735)
    />;
}

export default PageCarouselGesture;

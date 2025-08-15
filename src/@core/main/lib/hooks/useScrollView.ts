import {RefObject, useRef} from "react";
import {NativeScrollEvent, NativeSyntheticEvent, ScrollView, View as NativeView} from "react-native";
import Animated from "react-native-reanimated";

export function useScrollView(ref: RefObject<ScrollView | Animated.ScrollView | undefined> | undefined) {

    const scrollPos = useRef<number>(0)

    const scrollToView = (viewRef: NativeView) => {
        if (ref && ref.current && viewRef) {
            (ref.current as unknown as NativeView).measure((x, y, width, height, pageX, pageY) => {
                viewRef.measureInWindow((x, y, width, height) => {
                    const top = scrollPos.current + y - pageY
                    ref.current?.scrollTo({
                        y: top
                    })
                })
            })
        }
    }

    const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        scrollPos.current = e.nativeEvent.contentOffset.y
    }

    return {
        onScroll,
        scrollToView,
    }
}


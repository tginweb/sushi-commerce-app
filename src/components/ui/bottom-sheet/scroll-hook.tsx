import {SharedValue, useSharedValue, useWorkletCallback,} from 'react-native-reanimated';

import {
    ScrollEventHandlerCallbackType,
    ScrollEventsHandlersHookType,
    useScrollEventsHandlersDefault,
} from '~ui/bottom-sheet-vendor';
import {ScrollEventContextType} from '~ui/bottom-sheet-vendor/hooks/useScrollEventsHandlersDefault';

export const useScrollEventsHandlersCustom: () => {
    useDefaultHook: ScrollEventsHandlersHookType;
    scrollY: SharedValue<number>;
} = () => {
    const scrollY = useSharedValue(0);

    return {
        useDefaultHook: (scrollableRef, scrollableContentOffsetY) => {
            const {handleOnScroll, ...rest} = useScrollEventsHandlersDefault(
                scrollableRef,
                scrollableContentOffsetY,
            );

            const handleOnScrollCustom: ScrollEventHandlerCallbackType<ScrollEventContextType> =
                useWorkletCallback(
                    (event, ctx) => {
                        scrollY.value = event.contentOffset.y;
                        // @ts-ignore
                        handleOnScroll?.(event, ctx);
                    },
                    [handleOnScroll, scrollY],
                );

            return {
                ...rest,
                handleOnScroll: handleOnScrollCustom,
            };
        },
        scrollY,
    };
};

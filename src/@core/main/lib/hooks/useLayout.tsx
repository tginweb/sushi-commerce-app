import {RefObject, useCallback, useState} from "react";
import {LayoutChangeEvent, LayoutRectangle, ScrollView, View as NativeView} from "react-native";
import {TLayoutMeasure} from "@core/main/types";
import Animated from "react-native-reanimated";
import {useDebounceCallback} from "@core/main/lib/hooks/useDebounceCallback";

type TUseLayout = {
    enable?: boolean
    testId?: string
    debounced?: number | boolean
}

export function useLayout(ref: RefObject<NativeView | Animated.View | ScrollView | undefined>, options: TUseLayout = {}): TLayoutScope {

    const {
        testId,
        debounced,
        enable = true
    } = options

    const [measure, setMeasure] = useState<TLayoutMeasure>({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        pageX: 0,
        pageY: 0,
        centerY: 0,
        centerX: 0
    })

    const [rect, setRect] = useState<LayoutRectangle>({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    })

    if (!enable) {
        return {
            ref,
            measure,
            rect,
            onLayout: () => {},
            onContentSizeChange: () => {},
        }
    }

    const _debounced = debounced ? (typeof debounced === 'number' ? debounced : 20) : false

    const setMeasureDebounced = useDebounceCallback(setMeasure, _debounced || 0)
    const setRectDebounced = useDebounceCallback(setRect, _debounced || 0)

    const onContentSizeChange = useCallback((w: number, h: number) => {
        measure.height = h
        measure.width = w
    }, [])

    const onLayout = useCallback((e: LayoutChangeEvent, onDone?: (measure: TLayoutMeasure) => void) => {

        const _ref = ref as RefObject<NativeView>
        _debounced ? setRectDebounced( e.nativeEvent.layout) : setRect( e.nativeEvent.layout)
        if (_ref && _ref.current) {
            if (_ref.current.measure) {
                _ref.current.measure((x, y, width, height, pageX, pageY) => {
                    const data = {
                        x,
                        y,
                        width,
                        height,
                        pageX,
                        pageY,
                        centerX: width / 2,
                        centerY: height / 2,
                    }
                    _debounced ? setMeasureDebounced(data) : setMeasure(data)
                    onDone && onDone(data)
                })
            }
        }
    }, [_debounced])

    return {
        ref,
        measure,
        rect,
        onLayout,
        onContentSizeChange
    }
}

export type TLayoutScope = {
    ref: RefObject<NativeView | Animated.View | ScrollView | undefined>
    measure: TLayoutMeasure
    rect: LayoutRectangle,
    onLayout: (e: LayoutChangeEvent, onDone?: (measure: TLayoutMeasure) => void) => void
    onContentSizeChange: (w: number, h: number) => void
}

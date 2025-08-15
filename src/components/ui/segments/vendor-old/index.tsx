import _map from "lodash/map";
import _throttle from "lodash/throttle";
import React, {useCallback, useEffect, useRef} from 'react';
import {StyleSheet, ViewStyle} from 'react-native';
import Reanimated, {
    Easing,
    runOnJS,
    useAnimatedReaction,
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from 'react-native-reanimated';
import {BorderRadiuses, Colors, Spacings} from "react-native-ui-lib/style";
import {asBaseComponent, Constants} from "react-native-ui-lib/src/commons/new";
import {View} from "react-native-ui-lib";
import {Segment} from "./segment";
import {SegmentedControlItemProps} from "./types-segment";
import {SegmentedControlProps} from "./types-segmented-control";

const BORDER_WIDTH = 1;
const TIMING_CONFIG = {
    duration: 300,
    easing: Easing.bezier(0.33, 1, 0.68, 1)
};
export type {SegmentedControlItemProps, SegmentedControlProps};
/**
 * @description: SegmentedControl component for toggling two values or more
 * @example: https://github.com/wix/react-native-ui-lib/blob/master/demo/src/screens/componentScreens/SegmentedControlScreen.tsx
 */
export const SegmentedControl = (props: SegmentedControlProps) => {
    const {
        onChangeIndex,
        initialIndex = 0,
        containerStyle,
        style,
        segments,
        activeColor = Colors.$textPrimary,
        borderRadius = BorderRadiuses.br100,
        backgroundColor = Colors.$backgroundNeutralLight,
        activeBackgroundColor = Colors.$backgroundDefault,
        inactiveColor = Colors.$textNeutralHeavy,
        outlineColor = activeColor,
        outlineWidth = BORDER_WIDTH,
        throttleTime = 0,
        segmentsStyle: segmentsStyleProp,
        segmentLabelStyle,
        testID,
        readonly,
        itemStyle
    } = props;
    const animatedSelectedIndex = useSharedValue(initialIndex);


    const segmentsStyle = useSharedValue<any>([]);
    const segmentedControlHeight = useSharedValue(0);
    const segmentsCounter = useRef(0);
    useEffect(() => {
        animatedSelectedIndex.value = initialIndex;
    }, [initialIndex, animatedSelectedIndex]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const changeIndex = useCallback(_throttle(() => {
        onChangeIndex?.(animatedSelectedIndex.value);
    }, throttleTime, {
        trailing: true,
        leading: false
    }), [throttleTime, onChangeIndex])

    useAnimatedReaction(() => {
        return animatedSelectedIndex.value;
    }, (selected, previous) => {
        if (selected !== -1 && previous !== null && selected !== previous) {
            onChangeIndex && runOnJS(changeIndex)();
        }
    }, [changeIndex]);
    const onSegmentPress = useCallback((index: number) => {
        animatedSelectedIndex.value = index;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const onLayout = useCallback((index: number, event: any) => {
            const {
                x,
                width,
                height
            } = event.nativeEvent.layout;
            segmentsStyle.value[index] = {
                x,
                width
            };
            segmentedControlHeight.value = height + 2 * BORDER_WIDTH;
            segmentsCounter.current++;
            if (segmentsCounter.current === segments?.length) {
                segmentsStyle.value = [...segmentsStyle.value];
                segmentsCounter.current = 0; // in case onLayout will be called again (orientation change etc.)
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [initialIndex, segments?.length]);
    const animatedStyle = useAnimatedStyle(() => {

        if (segmentsStyle.value.length !== 0) {
            const isFirstElementSelected = animatedSelectedIndex.value === 0;
            const isLastElementSelected = animatedSelectedIndex.value === segmentsStyle.value.length - 1;
            const xOffset = isFirstElementSelected ? -2 : isLastElementSelected ? 2 : 0;
            const inset = withTiming(segmentsStyle.value[animatedSelectedIndex.value].x + xOffset, TIMING_CONFIG);
            const width = withTiming(segmentsStyle.value[animatedSelectedIndex.value].width * BORDER_WIDTH, TIMING_CONFIG);

            const borderWidth = segmentsStyle.value[animatedSelectedIndex.value].width > 10 ? 1 : 0;
            const height = segmentedControlHeight.value;

            const res: ViewStyle = Constants.isRTL ? {
                width,
                right: inset,
                height,
                borderWidth
            } : {
                width,
                left: inset,
                height,
                borderWidth
            };

            return res
        }
        return {};
    });


    const renderSegments = () => _map(segments, (_value, index) => {
        return <Segment
            readonly={readonly}
            key={index}
            onLayout={onLayout}
            index={index}
            onPress={onSegmentPress}
            selectedIndex={animatedSelectedIndex}
            activeColor={activeColor}
            inactiveColor={inactiveColor}
            style={segmentsStyleProp}
            segmentLabelStyle={segmentLabelStyle}
            {...segments?.[index]}
            testID={testID}
        />;
    });
    return <View style={containerStyle} testID={testID}>
        <View row center style={[styles.container, style, {
            borderRadius,
            backgroundColor
        }]}>
            <Reanimated.View style={[styles.selectedSegment, {
                borderColor: outlineColor,
                borderRadius,
                backgroundColor: activeBackgroundColor,
                borderWidth: outlineWidth,
            }, itemStyle, animatedStyle]}/>
            {renderSegments()}
        </View>
    </View>;
};
const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.$backgroundNeutralLight,
        borderColor: Colors.$outlineDefault,
        borderWidth: BORDER_WIDTH
    },
    selectedSegment: {
        position: 'absolute'
    },
    segment: {
        paddingHorizontal: Spacings.s3
    }
});
SegmentedControl.displayName = 'SegmentedControl';
export default asBaseComponent(SegmentedControl);

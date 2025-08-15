import React, {useCallback, useMemo} from 'react';
import Reanimated, {useAnimatedStyle} from 'react-native-reanimated';
import {Spacings} from "react-native-ui-lib/style";
import {asBaseComponent} from "react-native-ui-lib/src/commons/new";
import {TouchableOpacity, Typography} from "react-native-ui-lib";
import {SegmentProps} from "./types-segment";

/**
 * Segment sub-component for SegmentedControl component
 */
export const Segment = React.memo((props: SegmentProps) => {
    const {
        activeColor,
        label,
        iconSource,
        iconStyle,
        selectedIndex,
        onLayout,
        onPress,
        inactiveColor,
        index,
        iconOnRight,
        style,
        segmentLabelStyle,
        testID,
        readonly,
        hidden
    } = props;
    const animatedTextStyle = useAnimatedStyle(() => {
        const color = selectedIndex?.value === index ? activeColor : inactiveColor;
        return {
            color
        };
    });
    const animatedIconStyle = useAnimatedStyle(() => {
        const tintColor = selectedIndex?.value === index ? activeColor : inactiveColor;
        return {
            tintColor
        };
    });
    const segmentStyle = useMemo(() => {
        return [{
            paddingHorizontal: Spacings.s3,
            paddingVertical: Spacings.s2
        }, style];
    }, [style]);
    const renderIcon = useCallback(() => {
        return iconSource && <Reanimated.Image source={iconSource} style={[animatedIconStyle, iconStyle]}/>;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [iconSource, iconStyle]);
    const onSegmentPress = useCallback(() => {
        if (readonly)
            return;
        selectedIndex?.value !== index && onPress?.(index);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [index, onPress, readonly]);
    const segmentOnLayout = useCallback((event: any) => {
        onLayout?.(index, event);
    }, [onLayout, index]);

    const labelRendered = typeof label === 'string' || typeof label === 'number' ?
        <Reanimated.Text
            // @ts-ignore
            fsTagName={'unmasked'}
            numberOfLines={1}
            style={[
                Typography.text90,
                segmentLabelStyle,
                animatedTextStyle
            ]}
        >
            {label}
        </Reanimated.Text>
        :
        label

    return <TouchableOpacity
        onLayout={segmentOnLayout}
        style={hidden ?
            {
                paddingHorizontal: 0,
                paddingVertical: 0,
                maxWidth: 0
            }
            :
            segmentStyle
        }
        onPress={onSegmentPress}
        row flexG center
        testID={`${testID}.${index}`}
    >
        {!iconOnRight && renderIcon()}
        {labelRendered}
        {iconOnRight && renderIcon()}
    </TouchableOpacity>
});
export default asBaseComponent(Segment);

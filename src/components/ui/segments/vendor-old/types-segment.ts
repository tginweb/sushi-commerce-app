import React from 'react';
import { LayoutChangeEvent, ImageSourcePropType, ImageStyle, StyleProp, ViewStyle } from 'react-native';
import Reanimated from 'react-native-reanimated';
import { SegmentedControlProps } from './types-segmented-control';
export type SegmentedControlItemProps = Pick<SegmentedControlProps, 'segmentLabelStyle'> & {
    /**
     * The label of the segment.
     */
    label?: string;
    /**
     * An icon for the segment.
     */
    iconSource?: ImageSourcePropType;
    /**
     * An icon for the segment.
     */
    iconStyle?: StyleProp<ImageStyle>;
    /**
     * Should the icon be on right of the label
     */
    iconOnRight?: boolean;

    readonly?: boolean
};
export type SegmentProps = SegmentedControlItemProps & {
    /**
     * Shared value of the current selected index.
     */
    selectedIndex?: Reanimated.SharedValue<number>;
    /**
     * The color of the active segment (label and outline).
     */
    activeColor?: string;
    /**
     * The color of the inactive segment (label).
     */
    inactiveColor?: string;
    /**
     * Callback for when segment has pressed.
     */
    onPress?: (index: number) => void;
    /**
     * The index of the segment.
     */
    index: number;
    /**
     * onLayout function.
     */
    onLayout?: (index: number, event: LayoutChangeEvent) => void;
    /**
     * Additional style for the segment.
     */
    style?: StyleProp<ViewStyle>;
    testID?: string;

    readonly?: boolean

    hidden?: boolean
};
declare const _default: React.ForwardRefExoticComponent<Pick<SegmentedControlProps, "segmentLabelStyle"> & {
    /**
     * The label of the segment.
     */
    label?: string | undefined;
    /**
     * An icon for the segment.
     */
    iconSource?: ImageSourcePropType | undefined;
    /**
     * An icon for the segment.
     */
    iconStyle?: StyleProp<ImageStyle>;
    /**
     * Should the icon be on right of the label
     */
    iconOnRight?: boolean | undefined;
} & {
    /**
     * Shared value of the current selected index.
     */
    selectedIndex?: Reanimated.SharedValue<number> | undefined;
    /**
     * The color of the active segment (label and outline).
     */
    activeColor?: string | undefined;
    /**
     * The color of the inactive segment (label).
     */
    inactiveColor?: string | undefined;
    /**
     * Callback for when segment has pressed.
     */
    onPress?: ((index: number) => void) | undefined;
    /**
     * The index of the segment.
     */
    index: number;
    /**
     * onLayout function.
     */
    onLayout?: ((index: number, event: LayoutChangeEvent) => void) | undefined;
    /**
     * Additional style for the segment.
     */
    style?: StyleProp<ViewStyle>;
    testID?: string | undefined;
} & React.RefAttributes<any>>;
export default _default;

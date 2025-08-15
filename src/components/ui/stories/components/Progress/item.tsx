import React, {FC, memo} from 'react';
import {View} from 'react-native';
import Animated, {useAnimatedStyle} from 'react-native-reanimated';
import {StoryProgressItemProps} from '../../core/dto/componentsDTO';
import ProgressStyles from './Progress.styles';
import {PROGRESS_ACTIVE_COLOR, PROGRESS_COLOR} from '../../core/constants';

const AnimatedView = Animated.createAnimatedComponent(View);

const ProgressItem: FC<StoryProgressItemProps> = (
    {
        progress,
        activeIndex,
        index,
        width,
        progressActiveColor = PROGRESS_ACTIVE_COLOR,
        progressColor = PROGRESS_COLOR,
    }
) => {

    const animatedStyle = useAnimatedStyle(() => {

        if (activeIndex.value < index) {
            return {width: 0}
        } else if (activeIndex.value > index) {
            return {width}
        } else {
            return {width: width * progress.value};
        }
    }, [index]);

    return (
        <View style={[ProgressStyles.item, {backgroundColor: progressColor}, {width}]}>
            <AnimatedView
                style={[ProgressStyles.item, {backgroundColor: progressActiveColor}, animatedStyle]}
            />
        </View>
    );

};

export default memo(ProgressItem);

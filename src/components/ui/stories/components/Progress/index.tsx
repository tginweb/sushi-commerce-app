import React, {FC, memo} from 'react';
import {View} from 'react-native';
import ProgressItem from './item';
import {WIDTH} from '../../core/constants';
import ProgressStyles from './Progress.styles';
import {StoryProgressProps, TProgressItem} from '../../core/dto/componentsDTO';
import {useDerivedValue} from "react-native-reanimated";
import {wWidth} from "~assets/design";


const Progress: FC<StoryProgressProps> = (
    {
        allStories,
        progress,
        active,
        activeOfferId,
        activeOfferIndex,
        activeSlideIndex,
        length,
        progressActiveColor, progressColor,
        containerWidth = wWidth
    }
) => {

    const parts: TProgressItem[] = []

    let count = 0

    for (const offer of allStories) {
        for (const slide of offer.stories) {
            count++
        }
    }

    const activeIndex = useDerivedValue(
        () => {
            let index = 0
            for (const offer of allStories) {
                let slideIndex = 0
                for (const slide of offer.stories) {
                    if (activeOfferId.value === offer.id && activeSlideIndex.value === slideIndex) {
                        return index
                    }
                    slideIndex++
                    index++
                }
            }
            return 0
        }, [])

    const width = ((containerWidth - ProgressStyles.container.left * 2) - (count - 1) * ProgressStyles.container.gap) / count;


    return (
        <View style={[ProgressStyles.container, {width: containerWidth}]}>
            {[...Array(count).keys()].map((i) => (
                <ProgressItem
                    progress={progress}
                    index={i}
                    activeIndex={activeIndex}
                    width={width}
                    key={i}
                    progressActiveColor={progressActiveColor}
                    progressColor={progressColor}
                />
            ))}
        </View>
    );

};

export default memo(Progress);

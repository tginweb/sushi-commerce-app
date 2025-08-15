import React, {FC, memo} from 'react';
import Animated, {useAnimatedStyle, useDerivedValue, useSharedValue} from 'react-native-reanimated';
import StoryAnimation from '../Animation';
import ListStyles from './List.styles';
import StoryImage from '../Image';
import {StoryListProps} from '../../core/dto/componentsDTO';
import {HEIGHT} from '../../core/constants';
import StoryContent from '../Content';
import StoryFooter from '../Footer';

const StoryList: FC<StoryListProps> = (
    {
        id,
        stories,
        index,
        x,
        activeUser,
        activeStory,
        progress,
        seenStories,
        paused,
        onLoad,
        videoProps,
        progressColor,
        progressActiveColor,
        mediaContainerStyle,
        imageStyles,
        imageProps,
        listScroll,
        allStories,
        ...props
    }
) => {

    const imageHeight = useSharedValue(HEIGHT);
    const isActive = useDerivedValue(() => activeUser.value === id);

    const activeStoryIndex = useDerivedValue(
        () => stories.findIndex((item) => item.id === activeStory.value),
    );

    const animatedStyles = useAnimatedStyle(() => ({height: imageHeight.value}));

    const onImageLayout = (height: number) => {
        imageHeight.value = height;
    }

    const lastSeenIndex = stories.findIndex(
        (item) => item.id === seenStories.value[id],
    )

    const contentType = stories[lastSeenIndex + 1]?.contentType ?? stories[0]?.contentType
    const content = stories[lastSeenIndex + 1]?.content ?? stories[0]?.content
    const bgColor = stories[lastSeenIndex + 1]?.bgColor ?? stories[0]?.bgColor

    return (

        <StoryAnimation x={x} index={index}>

            <Animated.View style={[
                animatedStyles, ListStyles.container,
                {
                    //height: wHeight
                }
            ]}>

                <StoryImage
                    stories={stories}
                    activeStory={activeStory}
                    contentType={contentType}
                    content={content}
                    bgColor={bgColor}
                    onImageLayout={onImageLayout}
                    onLoad={onLoad}
                    paused={paused}
                    isActive={isActive}
                    videoProps={videoProps}
                    mediaContainerStyle={mediaContainerStyle}
                    imageStyles={imageStyles}
                    imageProps={imageProps}
                />

                <StoryContent stories={stories} active={isActive} activeStory={activeStory}/>

            </Animated.View>
            <StoryFooter stories={stories} active={isActive} activeStory={activeStory}/>
        </StoryAnimation>
    );

};

export default memo(StoryList);

import {View} from 'react-native';
import React, {FC, memo, useState} from 'react';
import {runOnJS, useAnimatedReaction, useDerivedValue, useSharedValue,} from 'react-native-reanimated';
import {StoryImageProps} from '../../core/dto/componentsDTO';
import Loader from '../Loader';
import {HEIGHT, LOADER_COLORS, WIDTH} from '../../core/constants';
import ImageStyles from './Image.styles';
import StoryVideo from './video';
import {ContentTypes} from "~ui/stories/core/types";
import {Text} from "react-native-ui-lib";
import {Image} from "expo-image";

const StoryImage: FC<StoryImageProps> = ({
                                             stories,
                                             activeStory,
                                             contentType,
                                             content,
                                             bgColor,
                                             paused,
                                             videoProps,
                                             isActive,
                                             mediaContainerStyle,
                                             imageStyles,
                                             imageProps,
                                             onImageLayout,
                                             onLoad,
                                         }) => {

    const [data, setData] = useState<{
        contentType: ContentTypes | undefined,
        content: string,
        bgColor: string
    }>(
        {
            contentType: contentType,
            content: content,
            bgColor: bgColor
        },
    );

    const loading = useSharedValue(true);
    const color = useSharedValue(LOADER_COLORS);
    const videoDuration = useSharedValue<number | undefined>(undefined);
    const isPaused = useDerivedValue(() => paused.value || !isActive.value);

    const onImageChange = async () => {

        if (!activeStory.value) {
            return;
        }

        const story = stories.find((item) => item.id === activeStory.value)

        if (!story) {
            return;
        }

        if (data.content === story.content) {
            if (!loading.value) {
                onLoad(videoDuration.value);
            }
        } else {
            loading.value = true
            setData({
                contentType: story.contentType,
                content: story.content,
                bgColor: story.bgColor
            })
        }

        const nextStory = stories[stories.indexOf(story) + 1];

        if (nextStory && nextStory.contentType === 'image') {
            try {
                Image.prefetch(nextStory.content);
            } catch (e) {

            }
        }
    }

    useAnimatedReaction(
        () => isActive.value,
        (res, prev) => res !== prev && res && runOnJS(onImageChange)(),
        [isActive.value],
    );

    useAnimatedReaction(
        () => activeStory.value,
        (res, prev) => res !== prev && runOnJS(onImageChange)(),
        [activeStory.value],
    );

    const onContentLoad = (duration?: number) => {
        if (data.contentType === 'video') {
            videoDuration.value = duration;
        }
        loading.value = false;
        if (isActive.value) {
            onLoad(duration);
        }
    }

    return (
        <>
            <View style={ImageStyles.container}>
                <Loader loading={loading} color={color} size={50}/>
            </View>
            <View style={[
                ImageStyles.image,
                mediaContainerStyle,
                {
                    flex: 1,
                    backgroundColor: data.bgColor
                }
            ]}>

                {
                    (() => {
                        switch (data.contentType) {
                            case 'html':
                                return <Text>{JSON.stringify(data.content)}</Text>
                                break
                            case 'video':
                                return <StoryVideo
                                    onLoad={onContentLoad}
                                    onLayout={onImageLayout}
                                    uri={data.content}
                                    paused={isPaused}
                                    isActive={isActive}
                                    {...videoProps}
                                />
                                break;
                            case 'image':
                                // @ts-ignore
                                return <Image
                                    source={{uri: data.content}}
                                    style={[
                                        {
                                            width: WIDTH,
                                            flex: 1,
                                            flexGrow: 1,
                                        },
                                        imageStyles
                                    ]}
                                    resizeMode="contain"
                                    testID="storyImageComponent"
                                    onLayout={(e) => onImageLayout(Math.min(HEIGHT, e.nativeEvent.layout.height))}
                                    // @ts-ignore
                                    onLoad={() => onContentLoad()}
                                    {...imageProps}
                                />
                                break
                        }
                    })()
                }

            </View>
        </>
    );

};

export default memo(StoryImage);

import React, { FC, memo } from 'react';
import {
  Image, Text, TouchableOpacity,
} from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, useDerivedValue, withTiming,
} from 'react-native-reanimated';
import { StoryAvatarProps } from '../../core/dto/componentsDTO';
import AvatarStyles from './Avatar.styles';
import Loader from '../Loader';
import { AVATAR_OFFSET } from '../../core/constants';
import {View} from "react-native-ui-lib";

const AnimatedImage = Animated.createAnimatedComponent( Image );

const StoryAvatar: FC<StoryAvatarProps> = ( {
  id,
  imgUrl,
  name,
  stories,
  loadingStory,
  seenStories,
  onPress,
  colors,
  seenColors,
  size,
  showName,
  nameTextStyle,
  showLoading= true
} ) => {


  const loaded = useSharedValue( false );
  const isLoading = useDerivedValue( () => (loadingStory && loadingStory.value === id) || !loaded.value );
  const loaderColor = useDerivedValue( () => (
      seenStories && (seenStories.value[id] === stories[stories.length - 1]?.id)
      ? seenColors
      : colors
  ) );

  const onLoad = () => {

    loaded.value = true;
  };

  const imageAnimatedStyles = useAnimatedStyle( () => (
    { opacity: withTiming( isLoading.value ? 0.5 : 1 ) }
  ) );

  return (
    <View style={AvatarStyles.name} gap-2>
      <View style={AvatarStyles.container}>
        <TouchableOpacity activeOpacity={0.6} onPress={onPress} testID={`${id}StoryAvatar${stories.length}Story`}>
          {showLoading && <Loader loading={isLoading}
              // @ts-ignore
                                  color={loaderColor} size={size + AVATAR_OFFSET * 2} />}
          <AnimatedImage
            source={{ uri: imgUrl }}
            style={[
              AvatarStyles.avatar,
              imageAnimatedStyles,
              { width: size, height: size, borderRadius: size / 2 },
            ]}
            testID="storyAvatarImage"
            onLoad={onLoad}
          />
        </TouchableOpacity>
      </View>
      {Boolean( showName ) && <Text style={nameTextStyle}>{name}</Text>}
    </View>
  );

};

export default memo( StoryAvatar );

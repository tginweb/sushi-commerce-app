import React, {FC, memo, useMemo, useState,} from 'react';
import {runOnJS, useAnimatedReaction} from 'react-native-reanimated';
import {StoryContentProps} from '../../core/dto/componentsDTO';
import ContentStyles from './Content.styles';
import {View} from "react-native-ui-lib";
import {UiBtnProps} from "~ui/btn";
import {COLORS, THEME_STYLE} from "~assets/design";
import {UiActions} from "~ui/actions";
import {useStores} from "~stores";
import {useServices} from "~services";
import excludeEmptyFields from "@core/main/util/base/excludeEmptyFields";
import {useSafeAreaInsets} from "react-native-safe-area-context";

const StoryContent: FC<StoryContentProps> = ({stories, active, activeStory}) => {

    const {offer: offerStore} = useStores()
    const {bus} = useServices()


    const [storyIndex, setStoryIndex] = useState(0);

    const onChange = async () => {

        'worklet';

        const index = stories.findIndex((item) => item.id === activeStory.value);
        if (active.value && index >= 0 && index !== storyIndex) {

            runOnJS(setStoryIndex)(index);

        }

    };

    useAnimatedReaction(
        () => activeStory.value,
        (res, prev) => res !== prev && onChange(),
        [activeStory.value],
    );

    const story = stories[storyIndex]

    const actions: UiBtnProps[] = []

    if (story) {
        const offer = story.offer
        if (offer) {

            if (offer.haveDetails) {
                actions.push({
                    label: 'подробнее',
                    onPress: () => {
                        bus.emitter.emit('bus:offers-insta.hide', 'action')
                        offerStore.openOffer(offer, 'sheet')
                    }
                })
            }
            if (offer.ACTIONS_MOBILE.length) {
                Array.prototype.push.apply(actions, excludeEmptyFields(offer.ACTIONS_MOBILE))
            }
        }
    }

    const content = useMemo(() => story?.renderContent?.(), [storyIndex]);

    const insets = useSafeAreaInsets()

    return <View
        paddingB-20
        paddingH-20
        style={[
            ContentStyles.actions,
            {
                //backgroundColor:
            }
        ]}
    >

        <UiActions
            items={actions}
            gap-13
            containerStyle={{
                marginBottom: insets.bottom | 16
            }}
            itemProps={{
                containerStyle: {
                    ...THEME_STYLE.shadow2
                },
                enableShadow: true,
                backgroundColor: COLORS.white,
                outlineWidth: 0,
                outlineColor: COLORS.white,
                color: COLORS.primary,
                labelStyle: {fontWeight: '600'},
                onPress: () => {
                    bus.emitter.emit('bus:offers-insta.hide', 'action')
                }
            }}
        />

    </View>
    //return content ? <View style={ContentStyles.container} pointerEvents="box-none">{content}</View> : null;

};

export default memo(StoryContent);

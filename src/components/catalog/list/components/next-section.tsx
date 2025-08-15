import React, {useImperativeHandle, useRef, useState} from "react";
import {Shadows, Text, TouchableOpacity, View} from "react-native-ui-lib";
import Animated, {interpolate, useAnimatedStyle, useSharedValue, withSpring} from "react-native-reanimated";
import {listStyles} from "../index.styles";
import {observer} from "mobx-react";
import {SectionModel} from "@core/main/model/Section";
import {useServices} from "~services";
import {View as NativeView} from "react-native";
import {wHeight} from "~assets/design";
import {TScrollState} from "@core/main/types";

type TProps = {
    nextSection: SectionModel
    onNext?: any
}

export const _CatalogNextSection: React.FC<TProps> = (
    {
        nextSection,
        onNext
    },
    ref
) => {
    const {imager} = useServices()

    const containerRef = React.useRef<NativeView | null>(null)

    const [enable, setEnable] = useState(true)
    const [bottomOverdrag, setBottomOverdrag] = useState(false)

    const nextSectionHeight = 200

    const currAnimRef = useRef(false)

    useImperativeHandle<any, any>(ref, () => ({
        onEndReached: (info: any) => {
            //console.log(info)

        },
        onScroll: (state: TScrollState) => {

            //console.log(state.speed)

            if (!enable)
                return;

            if (containerRef && containerRef.current) {
                // @ts-ignore
                containerRef.current?.measureInWindow((x: number, y: number, width: number, height: number) => {
                    const top = wHeight - y - tabBarHeight
                    if (top > 0) {
                        animHeight.value = withSpring(top, {})
                    } else {
                        animHeight.value = withSpring(0, {})
                    }
                })
            }
        }
    }))

    const tabBarHeight = 0

    const animHeight = useSharedValue(0.2);

    const additionalHeight = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => {

        const _height = animHeight.value > 200 ? 200 : animHeight.value
        return {
            transform: [
                {
                    scale: interpolate(_height, [0, nextSectionHeight], [0.5, 1], {}),
                },
            ]
        } as any
    })


    return <View
        style={{
            // height: wHeight,
        }}
    >
        <View
            marginT-20
            ref={containerRef}
            collapsable={false}
            style={{height: nextSectionHeight, opacity: 1}}
        >
            <Animated.View style={animatedStyle}>
                <View row centerH top>
                    <TouchableOpacity
                        onPress={() => onNext && onNext()}
                        style={[listStyles.nextSectionContainer, Shadows.sh30.bottom]}
                        padding-15
                        centerH
                    >
                        <Text text-lg-bo style={[listStyles.nextSectionName]}>
                            {nextSection?.NAME}
                        </Text>
                        {nextSection.imageSrc && (
                            <Animated.Image
                                style={[listStyles.nextSectionImage]}
                                source={{uri: nextSection.imageSrc}}
                                resizeMode="contain"
                            />
                        )}
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </View>
    </View>


}

// @ts-ignore
export const CatalogNextSection = observer(React.forwardRef(_CatalogNextSection))



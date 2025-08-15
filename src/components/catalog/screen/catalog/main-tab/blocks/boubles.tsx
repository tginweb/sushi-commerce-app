import React, {useEffect, useRef} from "react"
import {StyleSheet} from "react-native"
import {View} from "react-native-ui-lib"
import Animated, {
    useAnimatedProps,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming
} from "react-native-reanimated";
import Svg, {Path} from "react-native-svg";

type TBoubleProps = {
    width: number
    height: number
}

type TBoublesProps = {
    width: number
    height: number
    number?: number
}

export const Bouble: React.FC<TBoubleProps> = (props) => {

    const {
        width,
        height
    } = props

    const centerAnim = useSharedValue<{
        x: number,
        y: number
    }>({
        x: width / 2,
        y: height / 2
    })

    const minSize = height * 50 / 100
    const maxSize = height * 90 / 100

    const radiusAnim = useSharedValue<number>(minSize + Math.random() * (maxSize - minSize))
    const rotateAnim = useSharedValue<number>(0)

    useEffect(() => {
        rotateAnim.value = withRepeat(withTiming(360, {duration: 30000}), -2, false);

        setInterval(() => {
            radiusAnim.value = withTiming(minSize + Math.random() * (maxSize - minSize), {duration: 5000})
        }, 5000)

    }, [])

    const animatedStyles = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    rotate: rotateAnim.value + 'deg'
                }
            ]
        } as any
    }, [centerAnim.value, rotateAnim.value]);


    const animatedStyles1 = useAnimatedStyle(() => {
        return {
            //width: radiusAnim.value,
            //height: radiusAnim.value
        };
    }, [radiusAnim.value]);

    const AnimatedSvg = Animated.createAnimatedComponent(Svg);

    const animatedProps = useAnimatedProps(() => {
        return {
            width: radiusAnim.value,
            height: radiusAnim.value,
            right: 10,
            top: 10
        }
    }, [radiusAnim.value]);

    return <AnimatedSvg
        animatedProps={animatedProps}
        viewBox="0 0 17 22"
        fill={'#FFFFFF'}
        fillOpacity={0.14}
        style={[
            animatedStyles,
            {
                position: 'absolute'
            }
        ]}
    >
        <Path
            d="M3.544 16.539c-.976 0-1.769.792-1.769 1.765a1.769 1.769 0 0 0 3.538 0 1.77 1.77 0 0 0-1.77-1.765m0 4.51a2.75 2.75 0 0 1-2.751-2.745 2.75 2.75 0 0 1 5.502 0 2.75 2.75 0 0 1-2.751 2.745M12.583 1.505a1.77 1.77 0 0 0-1.769 1.765 1.769 1.769 0 0 0 3.538 0c0-.973-.793-1.765-1.77-1.765m0 4.51A2.75 2.75 0 0 1 9.832 3.27a2.75 2.75 0 0 1 5.502 0 2.75 2.75 0 0 1-2.751 2.745"/>
        <Path
            d="M7.882 1.536c-3.86.304-6.88 2.82-6.88 5.868 0 1.51.745 2.948 2.096 4.048l3.652 3.01a4.99 4.99 0 0 1 1.494 5.576c3.858-.304 6.88-2.82 6.88-5.869 0-1.508-.745-2.946-2.094-4.046L9.404 7.136a4.98 4.98 0 0 1-1.522-5.6m-.423 19.513h-.852l.427-.735a4 4 0 0 0 .538-2.01 4 4 0 0 0-1.45-3.089L2.474 12.21C.892 10.921.021 9.213.021 7.404.02 3.612 3.9.525 8.667.525h.851l-.426.735a4.014 4.014 0 0 0 .937 5.12l3.624 2.986c1.58 1.288 2.452 2.994 2.452 4.803 0 3.794-3.878 6.88-8.646 6.88"/>
    </AnimatedSvg>
}


export const Boubles: React.FC<TBoublesProps> = (
    props
) => {

    const {
        width,
        height,
        number = 1
    } = props

    const boubles = useRef(new Array(number).fill({})).current;

    return <View flex style={[styles.container, {
        width: width,
        height: height,
    }]}>


        {boubles.map((item, index) => (
            <Bouble
                key={index}
                width={width}
                height={height}
            />
        ))}

    </View>
}

const styles = StyleSheet.create({
    container: {},
    item: {},
    itemSelected: {},
})

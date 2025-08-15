import {Circle, CircleProps, ImageSVG, Skia, vec} from "@shopify/react-native-skia";
import React, {useEffect, useRef} from "react";
import {
    interpolateColor,
    useDerivedValue,
    useSharedValue,
    withDelay,
    withRepeat,
    withSequence,
    withTiming
} from "react-native-reanimated";

const BlurCircleColors = [
    "#FFFFFF20",
    "#FFFFFF20",
    // "#e8c2b2",
];

type Props = CircleProps & {
    /** Responsible for the time after which the animation starts in the circle */
    delay?: number;
    width: number
    height: number
};


const BlurCircle = (
    {
        delay = 0,
        width,
        height,
        ...props
    }: Props
): JSX.Element => {
    /** Randomly mixed colors */
    const colors = useRef(
        [...BlurCircleColors].sort(() => Math.random() - 0.5)
    ).current;
    /** Time to animate all colors */
    const colorAnimationDuration = useRef(colors.length * 1500).current;
    /** Parameter responsible for color animation */
    const color = useSharedValue(0);

    /** Parameter responsible for radius animation */
    const radius = useSharedValue(props.r);

    const animCenter = useSharedValue<{
        cx: number,
        cy: number
    }>({
        cx: Math.random() * width,
        cy: Math.random() * height
    })


    /** Radius of the animated circle */
    const radiusAnimationSize = useRef(props.r + props.r * 0.3).current;

    const animatedColor = useDerivedValue(() =>
        interpolateColor(
            color.value,
            colors.map((_, index) => index / (colors.length - 1)),
            [...colors]
        )
    );


    const runAnim = () => {

        radius.value = withTiming(30 + Math.random() * 50, {duration: 5000});

        animCenter.value = withTiming({
            cx: Math.random() * width,
            cy: Math.random() * height
        }, {duration: 5000});
    }

    useEffect(() => {
        // Change radius after delay and and loop it

        /*
        radius.value = withDelay(
            delay,
            withRepeat(
                withSequence(
                    withTiming(radiusAnimationSize, {duration: 2500}),
                    withTiming(props.r, {duration: 2500})
                ),
                -1
            )
        );

         */

        setInterval(runAnim, 5000)

        runAnim()

        // Change color after delay and and loop it
        color.value = withDelay(
            delay,
            withRepeat(
                withSequence(
                    withTiming(1, {duration: colorAnimationDuration}),
                    withTiming(0, {duration: colorAnimationDuration})
                ),
                -1
            )
        );
    }, [props.r, delay]);

    const c = useDerivedValue(() => {
        return vec(animCenter.value.cx, animCenter.value.cy)
    }, []);


    return <Circle {...props} r={radius} c={c} color={animatedColor}>

    </Circle>
};

export default BlurCircle;

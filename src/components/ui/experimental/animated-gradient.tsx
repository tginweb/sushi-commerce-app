import {StyleSheet,} from 'react-native';
import {Canvas, LinearGradient, Rect, vec} from '@shopify/react-native-skia';
import {useDerivedValue, useSharedValue, withTiming,} from 'react-native-reanimated';
import React, {useEffect, useRef} from "react";

export const getRandomColor = () => {
    // Generate random RGB color values
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);

    // Return the color in the format '#RRGGBB'
    return `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
};

export type TAnimatedGradientProps = {
    width: number
    height: number
}

export const AnimatedGradient: React.FC<TAnimatedGradientProps> = (props) => {

    let {
        width = 330,
        height = 330
    } = props

    //height = width

    const stepIndex = useRef(0);

    const steps: any[] = [
        {
            colors: ['#D16837', '#37A0D1'],
            start: {x: 0, y: 0},
            end: {x: width, y: height},
        },
        {
            colors: ['#D16837', '#eaae95'],
            start: {x: width / 2, y: 0},
            end: {x: width / 2, y: height},
        },
        {
            colors: ['#D16837', '#eaae95'],
            start: {x: width, y: 0},
            end: {x: 0, y: height},
        },
        {
            colors: ['#D16837', '#eaae95'],
            start: {x: width, y: height/2},
            end: {x: 0, y: height/2},
        },
        {
            colors: ['#D16837', '#eaae95'],
            start: {x: width, y: height},
            end: {x: 0, y: 0},
        },
        {
            colors: ['#D16837', '#eaae95'],
            start: {x: width/2, y: height},
            end: {x: width/2, y: 0},
        },
        {
            colors: ['#D16837', '#eaae95'],
            start: {x: 0, y: height},
            end: {x: width, y: 0},
        },
        {
            colors: ['#D16837', '#eaae95'],
            start: {x: 0, y: height/2},
            end: {x: width, y: height/2},
        },
    ]

    const time = 1000

    useEffect(() => {

        setInterval(() => {

            //return;
            const step = steps[stepIndex.current]

            step.colors.forEach((c: any, index: number) => {
               // animColors[index].value = withTiming(c, {duration: time});
            })


            /*
            animVecStart.value = withTiming({
                x: Math.random() * width,
                y: Math.random() * height
            }, {duration: time});

            animVecEnd.value = withTiming({
                x: Math.random() * width,
                y: Math.random() * height
            }, {duration: time});

             */

            animVecStart.value = withTiming(step.start, {duration: time});
            animVecEnd.value = withTiming(step.end, {duration: time});

            if (stepIndex.current === steps.length - 1)
                stepIndex.current = 0
            else
                stepIndex.current++
        }, time - 100)

    }, [])

    const animVecStart = useSharedValue<{
        x: number,
        y: number
    }>(steps[0].start)
    const animVecEnd = useSharedValue<{
        x: number,
        y: number
    }>(steps[0].end)

    const animColors = steps[0].colors.map((item) => useSharedValue(item))

    //const useSharedValue(steps[0].colors[0])

    const colors = useDerivedValue(() => {
        return animColors.map(item => item.value);
    }, [steps]);

    const vecStart = useDerivedValue(() => {
        return vec(animVecStart.value.x, animVecStart.value.y)
    }, [steps]);

    const vecEnd = useDerivedValue(() => {
        return vec(animVecEnd.value.x, animVecEnd.value.y)
    }, [steps]);


    return (
        <Canvas style={{flex: 1, height: height}}>
            <Rect x={0} y={0} width={width} height={height}>
                <LinearGradient
                    start={vecStart}
                    end={vecEnd}
                    colors={colors}
                />
            </Rect>
        </Canvas>
    )
}

const styles = StyleSheet.create({
    buttonContainer: {
        position: 'absolute',
        bottom: 52,
        right: 32,
        height: 64,
        aspectRatio: 1,
        borderRadius: 40,
        backgroundColor: '#111',
        zIndex: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
});



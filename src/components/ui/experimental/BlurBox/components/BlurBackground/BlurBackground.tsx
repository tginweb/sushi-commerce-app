import BlurCircle from "./components/BlurCircle/BlurCircle";
import styles from "./styles";
import {BlurMask, Canvas, Skia} from "@shopify/react-native-skia";
import React, {useEffect, useRef} from "react";
import {TAnimatedGradientProps} from "~ui/animated-gradient";

export type TProps = {
    width: number
    height: number
}

const svg = Skia.SVG.MakeFromString(
    `
   <svg  viewBox="0 0 17 22" fill='#FFFFFF' fill-opacity="0.3">
<path d="M3.54384 16.5389C2.56758 16.5389 1.77511 17.3311 1.77511 18.3038C1.77511 19.278 2.56905 20.0688 3.54384 20.0688C4.51863 20.0688 5.31257 19.2765 5.31257 18.3038C5.31404 17.3311 4.5201 16.5389 3.54384 16.5389ZM3.54384 21.0488C2.02652 21.0488 0.792969 19.8179 0.792969 18.3038C0.792969 16.7898 2.02652 15.5588 3.54384 15.5588C5.06115 15.5588 6.29471 16.7898 6.29471 18.3038C6.29618 19.8179 5.06115 21.0488 3.54384 21.0488Z" />
<path d="M12.5829 1.50507C11.6081 1.50507 10.8142 2.29732 10.8142 3.27002C10.8142 4.24419 11.6081 5.03498 12.5829 5.03498C13.5577 5.03498 14.3517 4.24273 14.3517 3.27002C14.3517 2.29732 13.5592 1.50507 12.5829 1.50507ZM12.5829 6.01502C11.0656 6.01502 9.83203 4.7841 9.83203 3.27002C9.83203 1.75594 11.0656 0.525024 12.5829 0.525024C14.1002 0.525024 15.3338 1.75594 15.3338 3.27002C15.3353 4.7841 14.1002 6.01502 12.5829 6.01502Z" />
<path d="M7.88204 1.53588C4.02258 1.83957 1.00265 4.3557 1.00265 7.40439C1.00265 8.91406 1.7466 10.3518 3.09778 11.4522L6.74993 14.4613C7.89674 15.4164 8.55395 16.816 8.55395 18.3037C8.55395 18.8979 8.44809 19.4862 8.24373 20.0378C12.1017 19.7341 15.1231 17.218 15.1231 14.1693C15.1231 12.6611 14.3792 11.2233 13.0295 10.123L9.40377 7.1359C8.23931 6.18227 7.57034 4.77236 7.57034 3.26855C7.57181 2.67583 7.67767 2.08752 7.88204 1.53588ZM7.4586 21.0487H6.60731L7.03369 20.3136C7.38656 19.7062 7.57181 19.0108 7.57181 18.3037C7.57181 17.108 7.04399 15.9827 6.12213 15.2154L2.47439 12.2092C0.892377 10.9211 0.0205078 9.21336 0.0205078 7.40439C0.0205078 3.61186 3.90055 0.525024 8.66716 0.525024H9.51845L9.09207 1.26006C8.73921 1.86891 8.55248 2.56433 8.55248 3.27002C8.55248 4.47893 9.0906 5.61156 10.0286 6.38033L13.6528 9.36594C15.2334 10.6541 16.1053 12.3603 16.1053 14.1693C16.1053 17.9633 12.2267 21.0487 7.4586 21.0487Z" />
</svg>
    `
)!;

const BlurBackground: React.FC<TAnimatedGradientProps> = (props): JSX.Element => {

    const {
        width,
        height
    } = props

    /** Radius of circle */
    const r = useRef(width / 2.5).current;
    /** An array responsible for how many circles will be located on the screen */
    const circles = useRef(new Array(2).fill(1)).current;
    /** The distance the elements will be located from each other */
    const step = height / circles.length;

    useEffect(() => {

        //const interval = setInterval(runAnim, 5000)

        return () => {
            //clearInterval(interval)
        }
    }, []);


    return (
        <Canvas style={[styles.background, {
            width: width,
            height: height,
        }]}>
            <BlurMask blur={20} style="solid"/>


            {circles.map((_, index) => (
                <BlurCircle
                    key={index}
                    // Arrange elements in a checkerboard pattern
                    width={width}
                    height={height}
                    r={r}
                    delay={index * 1000}
                />
            ))}
        </Canvas>
    );
};

export default BlurBackground;

import {Dimensions, PixelRatio, Platform} from 'react-native';
import * as Device from "expo-device";
import {DeviceType} from "expo-device/src/Device.types";

let {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
} = Dimensions.get('window');

//SCREEN_HEIGHT = 550
const [shortDimension, longDimension] = SCREEN_WIDTH < SCREEN_HEIGHT ? [SCREEN_WIDTH, SCREEN_HEIGHT] : [SCREEN_HEIGHT, SCREEN_WIDTH];

function getGuidelineSize() {
    if (Device.deviceType === DeviceType.TABLET ) {
        return [820 * 0.50, 1180 * 0.50]
    } else {
        return [370, 680]
    }
}

export const [guidelineBaseWidth, guidelineBaseHeight] = getGuidelineSize()

const scaleX = SCREEN_WIDTH / guidelineBaseWidth;

export function scaleFontSize(size: number) {
    //return size
    const newSize = size * scaleX
    if (Platform.OS === 'web') {
        return size
    } else {
        return Math.round(PixelRatio.roundToNearestPixel(newSize))
    }
}

export function scaleFont(
    {
        fontSize,
        lineHeightRatio,
        lineHeight
    }: {
        fontSize: number,
        lineHeightRatio?: number,
        lineHeight?: number
    }) {

    const _fontSize = scaleFontSize(fontSize)
    const _lineHeightRatio = lineHeightRatio || ((lineHeight || fontSize) / fontSize)

    return {
        fontSize: _fontSize,
        lineHeight: Math.round(_lineHeightRatio * _fontSize)
    }
}

export const scale = (size: number) => shortDimension / guidelineBaseWidth * size;
export const verticalScale = (size: number) => longDimension / guidelineBaseHeight * size;
export const moderateScale = (size: number, factor: number = 0.5) => size + (scale(size) - size) * factor;
export const moderateVerticalScale = (size: number, factor: number = 0.5) => size + (verticalScale(size) - size) * factor;



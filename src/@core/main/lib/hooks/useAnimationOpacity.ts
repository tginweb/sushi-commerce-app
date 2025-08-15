import {useStores} from "~stores";
import {useFocusEffect, useRouter} from "expo-router";
import {interpolate, useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";

export function useAnimationOpacity(
    {
        duration = 400
    }: {
        duration?: number
    } = {}
) {

    const visible = useSharedValue(1)

    const style = useAnimatedStyle(() => {
        return {
            opacity: interpolate(
                visible.value,
                [0, 1],
                [0, 1],
            ),
        }
    }, [])

    const show = () => {
        visible.value = withTiming(1, {duration})
    }

    const hide = () => {
        visible.value = withTiming(0, {duration})
    }

    return {
        style,
        show,
        hide
    }
}

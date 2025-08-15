import React, {forwardRef, useImperativeHandle} from "react";
import icons from "~assets/icons-map";
import {UiBtn} from "~ui/btn";
import {View, ViewProps} from "react-native-ui-lib";
import {interpolate, useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import {COLORS} from "~assets/design";

type CatalogScrollUpProps = ViewProps & {
    onPress?: () => void
}

export type CatalogScrollUpPublicMethods = {
    show: () => void
    hide: () => void
}

export const CatalogScrollUp = forwardRef<CatalogScrollUpPublicMethods, CatalogScrollUpProps>((
    {
        onPress,
        ...rest
    }
    , ref) => {

    const visibleValue = useSharedValue<number>(0)

    const containerAnimStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(visibleValue.value,
                [1, 0],
                [1, 0],
                {}
            ),
        }
    })

    useImperativeHandle<any, any>(ref, () => ({
        show: () => {
            visibleValue.value = withTiming(1, {duration: 300})
        },
        hide: () => {
            visibleValue.value = withTiming(0, {duration: 300})
        }
    }))

    return <View
        {...rest}
        reanimated
        style={[
            {
                position: 'absolute',
                left: 15,
                bottom: 15,
                zIndex: 200
            },
            containerAnimStyle
        ]}
    >
        <UiBtn
            icon={icons.chevronUp}
            backgroundColor={'rgba(236, 184, 161, 0.9)'}
            iconColor={COLORS.white}
            outlineColor={COLORS.white}
            iconSize={23}
            diameter={50}
            size={'large'}
            buttonStyle={{
                padding: 12
            }}
            onPress={onPress}
        />
    </View>
})


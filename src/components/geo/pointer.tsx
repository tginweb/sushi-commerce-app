import React, {useEffect} from "react"
import {ActivityIndicator, StyleSheet, ViewStyle} from "react-native"
import {COLORS, roundStyle, THEME_STYLE} from "~assets/design";
import {View} from "react-native-ui-lib";
import toInt from "@core/main/util/base/toInt";
import icons from "~assets/icons-map";
import {Shadow} from "react-native-shadow-2";
import {interpolate, useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";

export type MapPointerProps = {
    dragging?: boolean
    loading?: boolean
    size?: number | string
    color?: string
}

export const MapPointer: React.FC<MapPointerProps> = (
    {
        size = 50,
        color = COLORS.primary,
        dragging = false,
        loading = false
    },
    ref
) => {
    size = toInt(size)

    const logoSize = size * 0.55

    const draggingShared = useSharedValue(0)

    useEffect(() => {
        
        draggingShared.value = withTiming(dragging ? 1 : 0, {duration: 1000})
    }, [dragging]);

    const shadowAnimStyle = useAnimatedStyle(() => {
        const res: ViewStyle = {
            marginTop: interpolate(draggingShared.value, [0, 1], [0, 12], {}),
            opacity: interpolate(draggingShared.value, [0, 1], [0, 1], {}),
        }
        return res
    })

    return <View centerH>

        <Shadow distance={3}>
            <View
                style={[
                    {
                        ...roundStyle(size),
                        //backgroundColor: dragging ? COLORS.colorAspid : color,
                        backgroundColor: dragging ? COLORS.primary : COLORS.primary,
                        ...THEME_STYLE.shadow1,
                    }
                ]}
            >
                <View style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    {
                        loading ?
                            <ActivityIndicator color={'#ffffff'} size={logoSize}/>
                            :
                            dragging ? icons.geoTarget({size: logoSize, color: '#ffffff'}) : icons.logoMap({size: logoSize, color: '#ffffff'})
                    }
                </View>
            </View>
        </Shadow>

        <Shadow distance={2}>
            <View
                style={{
                    width: 3,
                    height: 20,
                    backgroundColor: color,
                }}
            >
            </View>
        </Shadow>

        <View
            reanimated
            style={[
                shadowAnimStyle
            ]}
        >
            <Shadow distance={9} startColor={'#00000060'}>
                <View
                    style={{
                        ...roundStyle(3),
                        backgroundColor: COLORS.grey20,
                    }}
                ></View>
            </Shadow>
        </View>

    </View>
}

const styles = StyleSheet.create({})

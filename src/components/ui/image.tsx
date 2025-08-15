import React, {useCallback, useMemo, useState} from "react"
import {Image as ExpoImage, ImageProps as ExpoImageProps} from "expo-image"
import {Image as NativeImage, StyleSheet, ImageProps as NativeImageProps, ImageStyle, Platform} from "react-native"
import {Colors} from "react-native-ui-lib"
import {TIconProps, TMaybe} from "@core/main/types"
import {ImageProps} from "expo-image/src/Image.types";
import toArray from "@core/main/util/base/toArray";

export type UiImageProps = NativeImageProps & ExpoImageProps & {
    vendor?: 'expo' | 'native' | 'wix'
    placeholderEnable?: boolean
    placeholderColor?: string
    placeholderImage?: any
    placeholderParams?: TIconProps,
    height?: string | number
    autoHeight?: boolean
    aspectRatio?: number
}

export const UiImage: React.FC<UiImageProps> = (props) => {

    const {
        source,
        vendor = 'expo',
        placeholderEnable,
        placeholderImage,
        placeholderColor = Colors.primary,
        placeholderParams = {
            width: '100%'
        },
        style = [],
        height,
        autoHeight,
        aspectRatio
    } = props

    let [isLoading, setIsLoading] = useState<boolean>(true)
    let [imageWidth, setImageWidth] = useState<number | null>(null)
    let [imageHeight, setImageHeight] = useState<number | null>(null)
    let [aspectRatioState, setAspectRatioState] = useState<number | undefined>(aspectRatio)

    const onLoad = useCallback(() => {
        //calcSizes()
        //setIsLoading(false)
    }, [])

    const imageStyle = useMemo(() => {
        const res: ImageStyle[] = Array.isArray(style) ? style as ImageStyle[] : [props.style as ImageStyle]
        if (height) {
            res.push({height: height})
        }
        if (aspectRatioState) {
            if (Platform.OS !== "web") {
                res.push({aspectRatio: aspectRatioState})
            }
        }
        return res
    }, [style, aspectRatioState, height])

    const _props = useMemo(() => {
        const res: Partial<ImageProps> = {}
        if (placeholderEnable) {
            res.placeholder = placeholderImage ? placeholderImage : require('~assets/img/placeholder.png')
        }
        return res
    }, [placeholderEnable])

    return <>

        {
            (() => {
                switch (vendor) {
                    case 'expo':
                        return <ExpoImage
                            {...props}
                            {..._props}
                            style={imageStyle}
                            placeholderContentFit={'contain'}
                            onLoad={onLoad}
                        />
                    case 'native':
                        return <NativeImage
                            {...props}
                            style={imageStyle}
                            onLoad={onLoad}
                        />
                    default:
                        return <></>
                }
            })()
        }
    </>
}

export const imagePrefetch = (urls: TMaybe<string> | TMaybe<string>[], cachePolicy?: 'memory-disk' | 'memory') => {
    const _urls = toArray(urls).filter(item => !!item)
    return _urls.length ? ExpoImage.prefetch(_urls, cachePolicy) : true
}

const styles = StyleSheet.create({})

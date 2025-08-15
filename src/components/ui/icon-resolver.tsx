import {TIconProps} from "@core/main/types";
import icons from "~assets/icons-map";
import {UiImage} from "~ui/image";
import React from "react";

export const iconResolver = (source: string | any, props: TIconProps) => {

    let iconRender: any

    if (typeof source === 'string') {

        let [iconSourceType, iconSourceVal] = source.split(':')

        if (!iconSourceVal) {
            iconSourceVal = iconSourceType
            iconSourceType = 'icon'
        }

        switch (iconSourceType) {
            case 'img':
            case 'img-expo':
                // @ts-ignore
                iconRender = (p: TIconProps) => <UiImage
                    vendor={'expo'}
                    source={{uri: iconSourceVal}}
                    {...p}
                />
                break
            case 'img-native':
                // @ts-ignore
                iconRender = (p: TIconProps) => <UiImage
                    vendor={'native'}
                    source={{uri: iconSourceVal}}
                    {...p}
                />
                break
            case 'icon':
            default:
                iconRender = icons[iconSourceVal as keyof typeof icons]
                break
        }
    } else if (typeof source === 'function') {
        iconRender = source
    } else if (typeof source === 'object') {
        iconRender = (p: TIconProps) => source
    }

    if (!iconRender)
        iconRender = () => null

    return props ? (p: TIconProps) => iconRender({...p, ...props}) : iconRender
}

export const iconResolve = (source: string | any, props: TIconProps) => iconResolver(source, props)()

import {SvgProps} from "react-native-svg/lib/typescript/elements/Svg";
import React from "react";
import {TIconRender, TIconProps} from "@core/main/types";

type IIconWrapper = (com: any, propsAlter?: (props: TIconProps) => SvgProps) => TIconRender

const iconWrapper: IIconWrapper = (Com, propsAlter) => {
    return (props) => {

        let svgProps: SvgProps & {key?: any} = {}

        if (props.size) {
            svgProps.width = svgProps.height = props.size
        } else {
            if (props.width)
                svgProps.width = props.width
            if (props.height)
                svgProps.height = props.height
        }

        if (props.style) {
            svgProps.style = props.style
        }

        if (props.key) {
            svgProps.key = props.key
        }

        if (propsAlter) {
            Object.assign(svgProps, propsAlter(props))
        }

        return <Com {...svgProps} key={svgProps.key}></Com>
    }
}

export default iconWrapper

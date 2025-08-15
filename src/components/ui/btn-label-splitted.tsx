import React from "react"
import {Text, View, ViewProps} from "react-native-ui-lib";
import {ViewStyle} from "react-native";

export type UiBtnSplittedProps = {
    sideSlot: any
    label: string
    labelProps?: ViewProps

    sideProps?: ViewProps
    sideStyle?: ViewStyle

    mainProps?: ViewProps
    mainStyle?: ViewStyle
}

export const UiBtnLabelSplitted: React.FC<UiBtnSplittedProps> = (props) => {

    const {
        label,
        sideSlot,
        sideProps = {
            centerH: true,
            flexG: true,
        },
        sideStyle,
        mainProps = {
            centerH: true,
            flexG: true
        },
        mainStyle= {
           // borderWidth1: 1
        },
        labelProps = {
            'text-lg-r-lh0': true,
            'white': true
        },
        ...rest
    } = props

    return <View row flex centerV paddingT-5 style={{width: '100%', height: 20}}>
        <View {...sideProps} style={sideStyle}>{sideSlot}</View>
        <View marginH-2 flex style={{maxWidth: 1, height: '80%', borderRightWidth: 1, borderColor: '#222222'}}></View>
        <View {...mainProps} style={mainStyle}><Text {...labelProps}>{label}</Text></View>
    </View>
}

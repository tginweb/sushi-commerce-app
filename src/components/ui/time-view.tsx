import React, {useMemo} from "react"
import {Text, View, ViewProps} from "react-native-ui-lib"
import {StyleProp, TextStyle} from "react-native"
import {formatTime, TFormatTimeProps} from "@core/main/util/date/formatTime";

export type UiTimeViewProps = ViewProps & TFormatTimeProps & {
    prepend?: any
    placeholder?: string
    dateHide?: boolean
    timeHide?: boolean
    textStyle?: StyleProp<TextStyle>
    textModifiers?: any
    contentModifiers?: any
}

export const UiTimeView: React.FC<UiTimeViewProps> = (props) => {

    const {
        prepend,
        value = null,
        valueDate,
        valueTime,
        timeHide,
        placeholder,
        dateHide,
        textModifiers,
        contentModifiers,
        textStyle,
        ...rest
    } = props

    const val = useMemo(() => {
        return formatTime(props)
    }, [value, valueDate, valueTime])

    return <View {...rest}>
        {
            val.value ?
                <View row style={{gap: 5}} {...contentModifiers}>
                    {prepend}
                    {!dateHide &&
                        <Text {...textModifiers} style={textStyle}>{val.dateFormatted}</Text>}
                    {!timeHide &&
                        <Text {...textModifiers} style={textStyle}>в {val.timeFormatted}</Text>}
                </View>
                :
                (
                    placeholder && <View>
                        <Text {...textModifiers} style={textStyle}>{placeholder}</Text>
                    </View>
                )
        }
    </View>
}

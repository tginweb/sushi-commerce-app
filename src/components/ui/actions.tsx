import React from "react"
import {View, ViewProps} from "react-native-ui-lib"
import {UiBtn, UiBtnProps} from "./btn"
import {StyleProp, ViewStyle} from "react-native"

export type UiActionsProps = ViewProps & {
    items: UiBtnProps[],
    itemProps?: UiBtnProps,
    containerStyle?: StyleProp<ViewStyle>
    prependSlot?: any
}

export const UiActions: React.FC<UiActionsProps> = (props) => {

    const {
        items = [],
        containerStyle = {},
        itemProps = {},
        prependSlot,
        ...rest
    } = props

    if (!Array.isArray(containerStyle)) {
        // containerStyle['gap'] = 10
    }

    return items && items.length ? (
        <View style={containerStyle} {...rest}>

            {prependSlot}
            {items.filter(item => !item.hidden).map((item, index) => {
                const props = {
                    ...itemProps,
                    ...item,
                }
                return (
                    item.containerStyle ?
                        <View
                            key={index}
                            style={item.containerStyle}
                        >
                            <UiBtn
                                {...props}
                            />
                        </View>
                        :
                        <UiBtn
                            key={index}
                            {...props}
                        />
                )
            })}
        </View>
    ) : <></>
}

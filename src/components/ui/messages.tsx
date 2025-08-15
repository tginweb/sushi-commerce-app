import React from "react"
import {View} from "react-native-ui-lib"

import {UiMessage} from "./message"
import {TMessages, TPresetName} from "@core/main/types"

type UiMessagesProps = {
    items: TMessages,
    preset?: TPresetName,
}

export const UiMessages: React.FC<UiMessagesProps> = (props) => {

    const {
        items = [],
        preset = 'outline',
        ...rest
    } = props

    const content = items && items.map((message, index) => <UiMessage
        key={index}
        message={message}
        preset={preset}
    />)

    return <View {...rest}>
        {content}
    </View>
}

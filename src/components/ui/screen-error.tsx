import React from "react"
import {Text, View} from "react-native-ui-lib"
import {StyleSheet} from "react-native"

export type UiScreenErrorProps = {
    title?: string
    caption?: string
}

export const UiScreenError: React.FC<UiScreenErrorProps> = (props) => {
    const {title, caption} = props
    return <View flex centerV>
        <View gap-20>
            <Text center>{title}</Text>
            <Text center>{caption}</Text>
        </View>
    </View>
}

const styles = StyleSheet.create({

})

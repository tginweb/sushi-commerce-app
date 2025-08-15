import React, {useCallback, useEffect, useState} from "react"
import {Text, View} from "react-native-ui-lib"
import {ActivityIndicator, StyleSheet, ViewStyle} from "react-native"
import {observer} from "mobx-react";
import {messageTypes} from "~ui/message/styles";
import {TMessage} from "@core/main/types";
import {useServices} from "~services";

export type UiStatusBarProps = {
    containerStyle?: ViewStyle
}

export const UiStatusBar: React.FC<UiStatusBarProps> = observer((props) => {

    const {
        containerStyle,
    } = props

    const {bus} = useServices()
    const [message, setMessage] = useState<TMessage | null>()
    const [timer, setTimer] = useState<any>()

    const statusBarShow = useCallback((message: TMessage) => {
        statusBarHide()
        if (timer)
            clearTimeout(timer)
        if (message.duration) {
            setTimer(setTimeout(() => {
                statusBarHide()
            }, message.duration))
        }
        setMessage(message)
    }, [])

    const statusBarHide = useCallback(() => {
        setMessage(null)
    }, [])

    useEffect(useCallback(() => {
        
        bus.emitter.on('statusBar.show', statusBarShow)
        bus.emitter.on('statusBar.hide', statusBarHide)

        return () => {

            bus.emitter.off('statusBar.show', statusBarShow)
            bus.emitter.off('statusBar.hide', statusBarHide)
        }

    }, [
        statusBarShow,
        statusBarHide,
    ]), [])

    if (!message) return <></>

    const _type = message.type || 'info'

    const messageType = messageTypes[_type]

    return <View
        row
        centerV
        paddingH-13
        paddingV-4
        style={[
            styles.container,
            containerStyle,
            {
                backgroundColor: messageType.bgColor
            }
        ]}
        center
        gap-8
    >
        {message.loading &&
            <View flexS>
                <ActivityIndicator/>
            </View>
        }
        <View>
            <Text white center text-sm-lh1>
                {message.title}
                {message.message}
            </Text>
        </View>
    </View>
})

const styles = StyleSheet.create({
    container: {},
})

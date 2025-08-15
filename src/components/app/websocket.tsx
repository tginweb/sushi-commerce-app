import React, {useCallback, useEffect, useMemo} from "react"
import {useStores} from "~stores"
import {observer} from "mobx-react"
import useWebSocket from 'react-native-use-websocket';
import {useServices} from "~services";
import {TWebsocketInboundMessage, TWebsocketMessage} from "@core/main/types";
import * as Device from "expo-device";
import AppConfig from "@core/main/config";
import {WebSocketEventMap} from "react-native-use-websocket/lib/typescript/src/lib/types";

export const Websocket: React.FC = observer(() => {

    const {debug, user} = useStores()
    const {bus} = useServices()


    //return <></>

    const socketUrl = useMemo(() => {
        let url = Device.isDevice ? AppConfig.WEBSOCKET_URL_DEVICE : AppConfig.WEBSOCKET_URL
        console.log('Connect to Websocket url', url)
        return url
    }, [])

    const onError = useCallback((event: WebSocketEventMap['error']) => {
       // debug.error('Websocket error', {message: event.message}, {scope: 'boot'})
    }, [])

    const onOpen = useCallback(() => {
        debug.info('Websocket connected', {}, {scope: 'boot'})
        setTimeout(() => {
            sendMessage({name: 'socket.sessionUpdate', data: user.getSessionData()})
        }, 1000)
    }, [])

    const onMessage = useCallback((message: WebSocketEventMap['message']) => {


        try {
            const event = JSON.parse(message.data) as TWebsocketInboundMessage
            debug.info('Websocket IN: ' + event.name, event.data, {scope: 'websocket'})
            bus.emit('websocket:' + event.name, event.data)
        } catch (e) {
            //console.log(e)
        }
    }, [])

    const shouldReconnect = useCallback((event: WebSocketEventMap['close']) => {
        return true
    }, [])

    const options = useMemo(() => {
        const res = user.makeRequestSessionContext()
        console.log('Websocket options', {
            ...res.headers,
            'Client-Context': null
        })
        return res
    }, [
        user.sessionId,
        user.clientId,
        user.userId,
    ])

    const {
        sendJsonMessage,
    } = useWebSocket(socketUrl, {
        onError,
        onOpen,
        onMessage,
        shouldReconnect,
        options
    })

    const sendMessage = useCallback((message: TWebsocketMessage) => {

        sendJsonMessage(message)
    }, [sendJsonMessage])

    useEffect(useCallback(() => {

        bus.on('websocket:sendMessage', sendMessage)
        return () => {
            bus.off('websocket:sendMessage', sendMessage)
        }
    }, [sendMessage]), [])

    return <></>
})

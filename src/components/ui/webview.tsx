import React, {useEffect, useImperativeHandle, useRef, useState} from "react"
import {WebView, WebViewProps} from "react-native-webview"
import {ActivityIndicator, StyleSheet, ViewStyle} from "react-native"
import {View} from "react-native-ui-lib"
import {WebViewErrorEvent, WebViewNavigationEvent} from "react-native-webview/src/WebViewTypes";
import {useStores} from "~stores";

export type TWebViewEvent = {
    name: string
}

export type TWebViewCommand<T> = T & {
    name: string
}

export type UiWebViewProps = WebViewProps & {
    url: string
    containerStyle?: ViewStyle
    width?: number
    height?: number
    onEvent?: (event: TWebViewEvent) => void
    debug?: boolean
}

export type UiWebViewApi<T = TWebViewCommand<any>> = {
    command: (command: T) => void
}

export type UiWebViewEventConsole = {
    name: 'console',
    data: any
}

export type UiWebViewEventSessionReload = {
    name: 'session-reload',
}

export type UiWebViewEventError = {
    name: 'error',
}

export type UiWebViewEvent = UiWebViewEventConsole | UiWebViewEventSessionReload | UiWebViewEventError

type TLoadingState = {
    timeout: any,
    loadingStartTime: number,
    attempts: number,
    status: boolean | null,
    isReloading: boolean,
}

const UiWebViewComponent: React.FC<UiWebViewProps> = (props, ref) => {

    const {
        url,
        containerStyle,
        style,
        width,
        height,
        onEvent,
        debug = false,
        onLoadEnd,
        ...rest
    } = props

    const {main} = useStores()

    const webref = React.createRef<WebView>()

    const [loadingState, setLoadingState] = useState<TLoadingState>({
        timeout: null,
        loadingStartTime: 0,
        attempts: 0,
        status: null,
        isReloading: false,
    })

    const loadingStateRef = useRef(loadingState)

    loadingStateRef.current = loadingState

    useEffect(() => {
        
        clearTimeout(loadingState.timeout)
        updateLoadingState({
            loadingStartTime: 0,
            attempts: 0,
            timeout: null,
            status: null,
            isReloading: false
        })
        return () => {
            clearTimeout(loadingState.timeout)
        }
    }, [])

    const updateLoadingState = (state: TLoadingState) => {
        setLoadingState(state)
        loadingStateRef.current = state
    }

    const onLoadingTimeout = (start = false) => {

        clearTimeout(loadingState.timeout)

        if (start) {
            updateLoadingState({
                loadingStartTime: 0,
                attempts: 0,
                timeout: null,
                status: null,
                isReloading: false
            })
            debug && console.log('onLoadingTimeout - start')
        } else {
            debug && console.log('onLoadingTimeout - attempt', loadingStateRef.current.attempts)
        }

        const loadingTime = Date.now() - loadingStateRef.current.loadingStartTime

        if (loadingTime > 1000 * 10) {
            if (loadingStateRef.current.attempts <= 3) {
                updateLoadingState({
                    ...loadingStateRef.current,
                    attempts: loadingStateRef.current.attempts + 1,
                    timeout: setTimeout(() => {
                        onLoadingTimeout()
                    }, 5000),
                    isReloading: !start
                })
                if (!start) {
                    debug && console.log('RELOAD')
                    webref.current?.reload()
                }
            }
        } else {
            updateLoadingState({
                ...loadingStateRef.current,
                status: false,
                attempts: 0,
                isReloading: false
            })
        }

        //console.log('onLoadingTimeout - STATE', loadingState)
    }

    const onLoadingSuccess = () => {
        clearTimeout(loadingState.timeout)
        setLoadingState({
            timeout: null,
            loadingStartTime: 0,
            attempts: 0,
            isReloading: false,
            status: null,
        })
    }

    useImperativeHandle<any, any>(ref, () => ({
        command
    }))

    const command = (command: TWebViewCommand<any>) => {
        const message = JSON.stringify(command)
        if (webref.current) {
            webref.current.injectJavaScript("window.messageProcess && window.messageProcess('" + message + "');");
        } else {
            console.log('LOST WEBVIEW MESSAGE', message)
        }
    }

    const _onEvent = (e: any) => {
        const message: UiWebViewEvent = JSON.parse(e.nativeEvent.data)
        debug && console.log(message)
        switch (message.name) {
            case 'session-reload':
                main.scopesFetch(['session', 'user'])
                break
            case 'error':
                console.error(message)
                break
        }
        onEvent && onEvent(message)
    }

    const onLoadStart = () => {
        debug && console.log('web START')
        onLoadingTimeout(!loadingState.isReloading)
    }

    const onLoad = () => {

    }

    const _onLoadEnd = (event: WebViewNavigationEvent | WebViewErrorEvent) => {

        onLoadEnd && onLoadEnd(event)

        const nativeEvent = event.nativeEvent
        debug && console.log('web END', nativeEvent)
        // @ts-ignore
        if (nativeEvent.code) {
            onLoadingTimeout()
        } else {
            onLoadingSuccess()
        }
    }

    const _containerStyle: ViewStyle = {}
    const _style: ViewStyle = {}

    if (width) {
        _containerStyle.width = width
        _style.width = width
    }

    if (height) {
        _containerStyle.height = height
        _style.height = height
    }

    const displaySpinner = () => {
        return (
            <View style={styles.loadingIndicator}>
                <ActivityIndicator color="#009688" size="large"/>
            </View>
        );
    }

    const refs = {
        layout: React.useRef<any>(),
    }

    return <View
        style={[styles.container, _containerStyle, containerStyle]}
        ref={refs.layout}
    >
        <WebView
            ref={webref}
            style={[styles.webview, _style, style]}
            onMessage={_onEvent}
            source={{
                uri: url
            }}
            userAgent={"Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36"}
            onLoadStart={onLoadStart}
            onLoad={onLoad}
            onLoadEnd={_onLoadEnd}
            startInLoadingState={true}
            bounces={false}
            //scalesPageToFit={true}
            androidLayerType={'hardware'}
            renderLoading={displaySpinner}
            webviewDebuggingEnabled={true}
            textInteractionEnabled={false}
            autoManageStatusBarEnabled={false}
            automaticallyAdjustsScrollIndicatorInsets={false}
            automaticallyAdjustContentInsets={false}
            {...rest}
        />
    </View>
}

// @ts-ignore
export const UiWebView = React.forwardRef<UiWebViewApi, UiWebViewProps>(UiWebViewComponent)

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    webview: {
        flex: 1,
    },
    loadingIndicator: {
        flex: 1,
        position: 'absolute',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 'auto',
        marginBottom: 'auto',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        justifyContent: 'center',
    },
    overlay: {
        backgroundColor: '#EEEEEE',
        opacity: 0.5,
        height: '100%',
        position: "absolute",
        zIndex: 300,
        left: 0,
        top: 0,
        width: '100%'
    }
})

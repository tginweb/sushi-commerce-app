import React, {useCallback, useMemo, useState} from "react"
import {StyleSheet} from "react-native"

import {observer} from "mobx-react"
import {useStores} from "~stores"
import {Dialog, Text, View} from "react-native-ui-lib";
import {UiBottomSheet, UiBottomSheetMethods, UiBottomSheetProps} from "~com//ui/bottom-sheet";
import {DialogProps} from "react-native-ui-lib/src/components/dialog";
import {CLOSER_BACK} from "~assets/icons-map";
import {wHeight} from "~assets/design";
import {UiWebView, UiWebViewApi} from "~ui/webview";
import {TMenuAction} from "@core/main/types";
import {WebViewErrorEvent, WebViewNavigationEvent} from "react-native-webview/src/WebViewTypes";

export type TWebViewProps = {}

type TWebviewModalEventClose = {
    name: 'close'
    redirect: TMenuAction
}

type TWebviewModalEvent = TWebviewModalEventClose

export const WebviewModal: React.FC<TWebViewProps> = observer((props) => {

    const {webviewDialog, menu} = useStores()

    const {
        mode = 'dialog',
        url,
        title,
        titleAuto,
        fullscreen,
        bottomOffsetTabbar,
        width,
        height,
    } = webviewDialog.props

    const webref = React.createRef<UiWebViewApi>()

    const [titleState, setTitleState] = useState(title)

    const compUrl = useMemo(() => {
        return url
    }, [url])

    const refs = {
        gift: React.useRef(),
        sheet: React.useRef<UiBottomSheetMethods>(null as any),
    }

    const sheetProps = useMemo<UiBottomSheetProps>(() => {
        const res: UiBottomSheetProps = {}

        if (fullscreen) {
            //res.snapPoints = ['98%']
            //res.snapIndex = 0
        }

        return res
    }, [width, height, fullscreen])

    const dialogProps = useMemo<DialogProps>(() => {
        const res: DialogProps = {} as DialogProps

        if (fullscreen) {
            res.height = '100%'
            res.width = '100%'
        } else {
            res.width = width ? width : '90%'
            res.height = height ? height : '90%'
        }

        return res
    }, [width, height, fullscreen])


    const onEvent = (event: TWebviewModalEvent) => {
        switch (event.name) {
            case "close":
                webviewDialog.hide()
                if (event.redirect)
                    menu.runActionItem(event.redirect)
                break
        }
    }

    const onLoadEnd = useCallback((event: WebViewNavigationEvent | WebViewErrorEvent) => {
        if (event) {
            const {nativeEvent} = event
            if (nativeEvent) {
                if (titleAuto && nativeEvent.title) {
                    setTitleState(nativeEvent.title)
                }
            }
        }
    }, [titleAuto])

    const webview = <UiWebView
        ref={webref}
        height={'sheet' && fullscreen ? wHeight - 80 : undefined}
        containerStyle={styles.webviewContainer}
        style={styles.webview}
        url={compUrl}
        startInLoadingState={false}
        //scalesPageToFit={true}
        androidLayerType={'hardware'}
        onEvent={onEvent as any}
        onLoadEnd={onLoadEnd}
    />

    switch (mode) {
        case 'sheet':
            return <UiBottomSheet
                id={'webview'}
                ref={refs.sheet}
                isVisible={webviewDialog.visible}
                bodyScrollable={true}
                targetModifiers={{
                    //body: ['paddingT-150']
                }}
                onClose={() => {
                    webviewDialog.hide(true)
                }}
                title={titleState}
                autoHeight={true}
                {...sheetProps}
            >
                {webview}
            </UiBottomSheet>
        case 'dialog':
            return <View>
                <Dialog
                    visible={webviewDialog.visible}
                    onDismiss={() => webviewDialog.hide()}
                    containerStyle={[
                        styles.dialogContainer,
                        fullscreen ? styles.dialogContainerFullscreen : styles.dialogContainerNormal,
                    ]}
                    useSafeArea={true}
                    // overlayBackgroundColor={'transparent'}
                    {...dialogProps}
                >
                    <View absT absR marginT-5 marginR-10 style={{zIndex: 10}}>
                        {CLOSER_BACK({size: 23, onPress: () => webviewDialog.hide()})}
                    </View>
                    {!!title &&
                        <View paddingV-8 paddingH-16 style={styles.dialogHeader}>
                            <Text text-md-m center>{titleState}</Text>
                        </View>
                    }
                    {webview}
                </Dialog>
            </View>
    }
})

export default WebviewModal

const styles = StyleSheet.create({
    webviewContainer: {
        flex: 1,
    },
    webview: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
    dialogHeader: {
        borderBottomWidth: 1,
        borderColor: '#CCCCCC'
    },
    dialogContainer: {
        backgroundColor: '#FFFFFF',
    },
    dialogContainerNormal: {
        borderRadius: 12,
    },
    dialogContainerFullscreen: {},
})

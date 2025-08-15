import React, {useRef, useState} from "react"
import {StyleSheet} from "react-native"

import {observer} from "mobx-react"
import {useStores} from "~stores"
import {UiBottomSheet} from "~com//ui/bottom-sheet";
import {View} from "react-native-ui-lib";
import {UiWebView, UiWebViewApi} from "~ui/webview";
import CaptchaConfig from "@core/captcha/config";
import {TCaptchaEvent, TCommand} from "../types/types";
import {CaptchaInput, CaptchaModel} from "~gql/api";
import {useWatch} from "@core/main/lib/hooks/useWatch";

export type TWebViewProps = {}

export const CaptchaDialog: React.FC<TWebViewProps> = observer((props) => {

    const {captchaDialog, ui, menu, router} = useStores()

    const {
        model,
        onSuccess
    } = captchaDialog.props

    const [modelState, setModelState] = useState<CaptchaModel>(model)

    const webviewRef = useRef<UiWebViewApi<TCommand>>(null as any)

    useWatch(() => {
        setModelState(model)
    }, [model])

    const createCaptchaInput = (result: CaptchaInput) => {
        const res: CaptchaInput = {
            SID: modelState.SID,
            PROVIDER: modelState.PROVIDER,
            ...result
        }
        return res
    }

    const onEvent = (event: TCaptchaEvent) => {
        switch (event.type) {
            case "error":
                break;
            case "success":
                captchaDialog.hide()
                setTimeout(() => {
                    onSuccess && onSuccess(createCaptchaInput(event.data))
                }, 1000)
                break;
        }
    }

    const url = router.makeSiteUrl(CaptchaConfig.CAPTCHA_URL, modelState, true)

    return <UiBottomSheet
        id={'captcha'}
        isVisible={captchaDialog.visible}
        bodyScrollable={false}
        targetModifiers={{
            //body: ['paddingT-150']
        }}
        snapPoints={['99%']}
        onClose={() => captchaDialog.hide(true)}
        autoHeight={false}
        enablePanDownToClose={false}
    >
        <View flex>
            <UiWebView
                url={url}
                ref={webviewRef.current as any}
                onEvent={onEvent as any}
            />
        </View>
    </UiBottomSheet>
})

export default CaptchaDialog

const styles = StyleSheet.create({})

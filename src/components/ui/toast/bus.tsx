import React, {useCallback, useEffect, useRef} from "react"
import {observer} from "mobx-react"
import Toast from "~ui/toast/toast-container";
import ToastContainer from "~ui/toast/toast-container";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {TMessage} from "@core/main/types";
import {messageTypes} from "~ui/message/styles";
import {ToastOptions} from "~ui/toast/toast";
import {ActivityIndicator, ViewStyle} from "react-native";
import {Text, View} from "react-native-ui-lib";
import {useServices} from "~services";
import {CATALOG_TABBAR_SIZES, COLORS} from "~assets/design";
import icons from "~assets/icons-map";
import {UiBtn} from "~ui/btn";
import {useStores} from "~stores";
import {UiActions} from "~ui/actions";
import {ToastNotices} from "~ui/toast/notices";

type TProps = {}

export const ToastBus: React.FC<TProps> = observer(({}) => {

    const {bus} = useServices()
    const {router, menu, notice} = useStores()

    const loadingMessageId = useRef<any>(null)

    const alertRef = useRef<ToastContainer>(null as any)
    const noticeRef = useRef<ToastContainer>(null as any)

    const insets = useSafeAreaInsets();

    const loadingMessageShow = (message: TMessage) => {
        loadingMessageHide()
        loadingMessageId.current = showAlert(message)
    }

    const catalogTabbarHeight = CATALOG_TABBAR_SIZES.CATALOG_TABBAR_HEIGHT

    const loadingMessageHide = () => {
        if (loadingMessageId.current) {
            alertRef.current?.hide(loadingMessageId.current)
            loadingMessageId.current = null
        }
    }

    const showAlert = (message: TMessage) => {

        if (typeof message === 'object') {

            const messageType = messageTypes[message.type as any]

            console.log('showAlert', message)

            const toastProps: ToastOptions & {
                style: ViewStyle
            } = {
                placement: 'top',
                ...messageType.toast,
                ...(message as any),
                style: {
                    backgroundColor: message.bgColor || messageType.bgColor,
                    borderRadius: 12
                }
            }

            console.log('toastProps', toastProps)


            if (message.onPress) {
                toastProps.onPress = (id: any) => message.onPress && message.onPress({
                    id,
                    // @ts-ignore
                    hide: () => alertRef.current.hide(id)
                })
            }

            let icon

            if (message.loading) {
                icon = <ActivityIndicator color={'#FFFFFF'}/>
                toastProps.duration = 60000
            }

            const messageElement = <View
                gap-8 row centerV paddingH-5
                style={[]}
            >
                {icon &&
                    <View>
                        {icon}
                    </View>
                }
                {
                    message.content ?
                        message.content
                        :
                        <View gap-2>
                            {message.title && <Text text-md white style={{fontWeight: '800'}}>
                                {message.title}
                            </Text>}
                            {message.message && <Text text-md white>
                                {message.message}
                            </Text>}
                        </View>
                }
            </View>


            return alertRef.current?.show(messageElement, toastProps)
        }
    }


    const showNotice = (message: TMessage) => {

        console.log('showNotice', message)

        if (typeof message === 'object') {

            const toastProps: ToastOptions & {
                style: ViewStyle
            } = {
                duration: 1000 * 5000,
                placement: 'top',
                style: {
                    backgroundColor: COLORS.grey10,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: COLORS.white
                }
            }

            toastProps.onPress = (id) => {
                if (message.actions && message.actions.length) {
                    noticeRef.current?.hide(id)
                    menu.runActionItem(message.actions[0])
                } else if (message.route) {
                    router.push(message.route)
                    noticeRef.current?.hide(id)
                } else if (message.onPress) {
                    message.onPress && message.onPress({
                        id,
                        hide: () => noticeRef.current?.hide(id)
                    })
                }
            }

            let icon

            const messageElement = <View
                gap-8 row centerV paddingH-5 paddingV-2
                style={{}}
            >
                {icon &&
                    <View>
                        {icon}
                    </View>
                }
                <View gap-6 flexS>

                    <View row>
                        <View flexS>
                            <Text text-sm-m-lh1 white>
                                {message.title || message.message}
                            </Text>
                        </View>
                        <View style={{width: 24}}>
                            <UiBtn
                                buttonStyle={{
                                    position: 'absolute',
                                    right: -8,
                                    top: -6
                                }}
                                icon={icons.xmark}
                                iconSize={17}
                                diameter={25}
                                round={true}
                                outline={true}
                                color={COLORS.white}
                                onPress={() => {
                                    toastId && noticeRef.current?.hide(toastId)
                                }}
                            />
                        </View>
                    </View>

                    {!!message.message && !!message.title && <Text text-sm-lh2 white>
                        {message.message}
                    </Text>}

                    <UiActions
                        items={notice.noticeActionsFilter(message.actions)}
                        row
                        itemProps={{
                            outline: true,
                            color: COLORS.white,
                            size: 'xSmall',
                            iconSize: 15,
                            buttonStyle: {},
                            onPress: () => {
                                toastId && noticeRef.current?.hide(toastId)
                            }
                        }}
                    />
                </View>
            </View>

            const toastId = noticeRef.current?.show(messageElement, toastProps)
            return toastId
        }
    }

    const showNotices = (messages: TMessage[]) => {

        const toastProps: ToastOptions & {
            style: ViewStyle
        } = {
            duration: 1000 * 20,
            placement: 'top',
            style: {
                backgroundColor: COLORS.grey10,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: COLORS.white
            }
        }

        toastProps.onPress = (id) => {

        }

        const element = <ToastNotices
            messages={messages}
            onClose={() => {
                toastId && noticeRef.current?.hide(toastId)
            }}
        />

        const toastId = noticeRef.current?.show(element, toastProps)
        return toastId
    }

    const onProcessAlert = (message: TMessage) => {
        onHideToasts()
        showAlert(message)
    }

    const onProcessAlerts = (messages: TMessage[]) => {
        if (messages.length) {
            onHideToasts()
            messages.forEach((message: TMessage) => showAlert(message))
        }
    }

    const onProcessResponse = (res: any) => {
        if (res.messages) {
            onProcessAlerts(res.messages)
        }
    }

    const onProcessNotice = (message: TMessage) => {
        onHideToasts()
        showNotice(message)
    }

    const onProcessNotices = (messages: TMessage[]) => {
        if (messages.length) {
            onHideToasts()
            showNotices(messages)
        }
    }

    const onHideToasts = () => {

        console.log('onHideToasts')
        noticeRef.current?.hideAll()
        alertRef.current?.hideAll()
    }

    useEffect(useCallback(() => {

        bus.emitter.on('hideToasts', onHideToasts)

        bus.emitter.on('processNotice', onProcessNotice)
        bus.emitter.on('processNotices', onProcessNotices)

        bus.emitter.on('processAlert', onProcessAlert)
        bus.emitter.on('processAlerts', onProcessAlerts)

        bus.emitter.on('processResponse', onProcessResponse)

        bus.emitter.on('loadingMessage.show', loadingMessageShow)
        bus.emitter.on('loadingMessage.hide', loadingMessageHide)

        return () => {
            bus.emitter.off('processNotice', onProcessNotice)
            bus.emitter.off('processNotices', onProcessNotices)

            bus.emitter.off('processAlert', onProcessAlert)
            bus.emitter.off('processAlerts', onProcessAlerts)

            bus.emitter.off('loadingMessage.show', loadingMessageShow)
            bus.emitter.off('loadingMessage.hide', loadingMessageHide)
        }

    }, []), [])

    return <>
        <Toast
            ref={alertRef}
            offsetTop={insets.top + catalogTabbarHeight}
            offsetBottom={insets.bottom + 70}
        />
        <Toast
            ref={noticeRef}
            offsetTop={insets.top}
            offsetBottom={insets.bottom + 70}
        />
    </>
})


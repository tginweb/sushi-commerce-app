import React, {useState} from "react"
import {observer} from "mobx-react"
import {TMessage} from "@core/main/types";
import {ToastOptions} from "~ui/toast/toast";
import {StyleSheet, ViewStyle} from "react-native";
import {PageControl, Text, View} from "react-native-ui-lib";
import {COLORS, wWidth} from "~assets/design";
import icons from "~assets/icons-map";
import {UiBtn} from "~ui/btn";
import {UiActions} from "~ui/actions";
import {useStores} from "~stores";

type TProps = {
    messages: TMessage[]
    onClose?: () => void
}

export const ToastNotices: React.FC<TProps> = observer((props) => {

    const {notice} = useStores()

    const {
        messages,
        onClose
    } = props

    const [currentMessageIndex, setCurrentMessageIndex] = useState<number>(0)


    const currentMessage = messages[currentMessageIndex]

    const toastProps: ToastOptions & {
        style: ViewStyle
    } = {
        duration: 1000 * 500,
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

    const messageRender = (message: TMessage) =>
        <View
            centerV paddingH-5 paddingV-2 gap-10
        >
            <View style={{marginRight: 24}}>
                <Text text-sm-m-lh1 white>
                    {message.title || message.message}
                </Text>
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

                    }
                }}
            />
        </View>

    return <View gap-10 style={{width: wWidth * 0.80}}>

        <UiBtn
            buttonStyle={{
                position: 'absolute',
                top: -3,
                right: 0,
                zIndex: 10
            }}
            icon={icons.xmark}
            iconSize={17}
            diameter={25}
            round={true}
            outline={true}
            color={COLORS.white}
            onPress={() => {
                onClose && onClose()
            }}
        />

        {currentMessage && messageRender(currentMessage)}

        {messages.length > 1 &&
            <View row>
                <View flex-1 style={[styles.navCol, styles.navColLeft]}>
                    {currentMessageIndex > 0 &&
                        <UiBtn
                            icon={icons.angleLeft}
                            size={'xSmall'}
                            iconSize={20}
                            link={true}
                            label={'назад'}
                            color={COLORS.white}
                            onPress={() => {
                                if (currentMessageIndex > 0)
                                    setCurrentMessageIndex(currentMessageIndex - 1)
                            }}
                        />
                    }
                </View>
                {false && <PageControl
                    numOfPages={messages.length}
                    currentPage={currentMessageIndex}
                    color={COLORS.grey40}
                    spacing={7}
                    containerStyle={{
                        flex: 3
                    }}
                    onPagePress={(v) => {
                        setCurrentMessageIndex(v)
                    }}
                />}
                <View flex-1 style={[styles.navCol, styles.navColRight]}>
                    {currentMessageIndex < messages.length - 1 &&
                        <UiBtn
                            icon={icons.angleRight}
                            size={'xSmall'}
                            iconSize={20}
                            iconOnRight={true}
                            link={true}
                            label={'еще'}
                            color={COLORS.white}
                            onPress={() => {
                                if (currentMessageIndex < messages.length - 1)
                                    setCurrentMessageIndex(currentMessageIndex + 1)
                            }}
                        />
                    }
                </View>
            </View>
        }
    </View>
})

const styles = StyleSheet.create({
    navCol: {
        //borderWidth: 1,
    },
    navColLeft: {
        alignItems: 'flex-start'
    },
    navColRight: {
        marginLeft: 'auto',
        alignItems: 'flex-end'
    },
});

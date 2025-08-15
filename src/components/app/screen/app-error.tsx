import React, {useCallback, useMemo} from "react"
import {StyleSheet} from "react-native"
import {Text, View} from "react-native-ui-lib"
import {observer} from "mobx-react"
import {TAppScreenProps} from "@core/main/types"
import {UiBtn, UiBtnProps} from "~ui/btn"
import * as Linking from "expo-linking"
import AppConfig from "@core/main/config"
import icons from "~assets/icons-map";
import {COLORS} from "~assets/design";
import {UiActions} from "~ui/actions";
import {platform} from "@core/main/lib/platform";
import {SafeAreaView, useSafeAreaInsets} from "react-native-safe-area-context"
import * as Clipboard from 'expo-clipboard';
import {useStores} from "~stores";
import UiInputDialog from "~ui/input-dialog";
import {UiDialog, useDialog} from "~ui/dialog";
import {UiTextarea} from "~ui/textarea";

export const AppErrorScreen: React.FC<TAppScreenProps> = observer((
    {
        message,
        title,
        actions = [],
        onActionUpdate,
        onActionReload,
        onActionSkip
    }
) => {
    const {debug, user} = useStores()

    const codeDialog = useDialog({})
    const reportDialog = useDialog({})

    const availableActions = {
        reload: {
            label: 'Попробовать снова',
            onPress: () => onActionReload && onActionReload()
        },
        update: {
            label: 'Обновить',
            onPress: () => {
                onActionUpdate && onActionUpdate()
                Linking.openURL(platform.getAppMarketUrl());
            }
        },
        skip: {
            label: 'Пропустить',
            onPress: () => onActionSkip && onActionSkip(),
            outline: true,
            color: COLORS.primary
        },
        site: {
            label: 'Перейти на сайт',
            onPress: () => Linking.openURL(AppConfig.APP_SITE_PROD_URL),
            outline: true,
            color: COLORS.primary
        },
        contact: {
            label: 'Связаться с нами',
            onPress: () => Linking.openURL(AppConfig.SUPPORT_PHONE),
            link: true,
            color: COLORS.primary
        },
    }


    const _actions = useMemo(() => {
        const res: UiBtnProps[] = actions.map(item => typeof item === 'string' ? availableActions[item] : item)
        return res
    }, [actions])

    const onOpenReport = useCallback(() => {
        if (!debug.grantReportAccess()) {
            codeDialog.show()
        } else {
            reportDialog.show()
        }
    }, [
        reportDialog.show,
        codeDialog.show
    ])

    const onCodeApply = useCallback((text: string) => {
        if (debug.grantReportAccess(text)) {
            console.log('granted')
            setTimeout(() => {
                reportDialog.show()
            }, 1000)
        } else {
            console.log('code error')
        }
    }, [
        reportDialog.show,
    ])

    const insets = useSafeAreaInsets()


    const bottomOffset = (insets.bottom || 20) + 15

    return (
        <SafeAreaView style={{flex: 1}}>
            <View flex centerV centerH>
                <View center paddingH-20 gap-20>
                    {icons.logoMini({size: 60, color: COLORS.primary})}
                    <Text center text-xl-m>{title}</Text>
                    <Text center text-md>{message}</Text>
                    <UiActions
                        items={_actions}
                        containerStyle={{
                            gap: 15
                        }}
                    />
                </View>
            </View>

            <View style={{position: 'absolute', right: 20, bottom: bottomOffset}}>
                <UiBtn
                    text-xs-lh0
                    link
                    size={'xSmall'}
                    label={'Отправить отчет'}
                    onPress={debug.sendDebugReport}
                    onLongPress={onOpenReport}
                />
            </View>

            <View style={{position: 'absolute', left: 20, bottom: bottomOffset}}>
                <Text text-xs-lh0>СNID {user.getClientNid()}</Text>
            </View>

            <UiInputDialog
                visible={codeDialog.visible}
                onClose={codeDialog.hide}
                title={'Введите код'}
                inputProps={{
                    label: 'Код',
                    presets: 'outline',
                } as any}
                onApply={onCodeApply}
            />

            <UiDialog
                visible={reportDialog.visible}
                onClose={reportDialog.hide}
                title={'Репорт'}
                height={'90%'}
                useSafeArea={true}
                actions={{
                    items: [
                        {
                            label: 'Копировать',
                            onPress: async () => {
                                Clipboard.setStringAsync(debug.getDebugReportJson())
                            }
                        }
                    ]
                }}
                childrenRender={() => {
                    return <View flex>
                        <UiTextarea
                            locked={true}
                            value={debug.getDebugReportJson()}
                        />
                    </View>
                }}
            />

        </SafeAreaView>
    );
});

export default AppErrorScreen

const styles = StyleSheet.create({});

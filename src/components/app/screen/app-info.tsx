import React, {useCallback} from "react"
import {StyleSheet} from "react-native"
import {observer} from "mobx-react"
import {TScreenProps} from "@core/main/types"
import {platform} from "@core/main/lib/platform"
import {UiScreen} from "~ui/screen"
import * as DeviceInfo from "expo-device"
import {UiList} from "~ui/list"
import {UiListItemProps} from "~ui/list-item";
import * as Clipboard from 'expo-clipboard';
import {UiBtn} from "~ui/btn";
import {COLORS} from "~assets/design";
import {useCounter} from "@core/main/lib/hooks/useCounter";
import {useStores} from "~stores";

export const AppInfoScreen: React.FC<TScreenProps> = observer(() => {

    const version = platform.getAppVersion()
    const buildVersionName = platform.getBuildVersionName()

    const counter = useCounter()

    const {debug} = useStores()

    const onPressDevice = useCallback(() => {
        counter.increment()
        if (counter.count > 10) {
            debug.showAccessModal()
        }
    }, [counter.count])

    const fields: UiListItemProps[] = [
        {
            label: 'Версия приложения',
            content: version,
        },
        {
            label: 'Версия сборки',
            content: buildVersionName,
        },
        {
            label: 'Брэнд',
            content: DeviceInfo.brand,
        },
        {
            label: 'ОС',
            content: DeviceInfo.osName
        },
        {
            label: 'ОС версия',
            content: DeviceInfo.osVersion
        },
        {
            label: 'Устройство',
            content: DeviceInfo.deviceName,
            onPress: onPressDevice,
            showMore: false
        },
    ]

    const onCopyDebug = async () => {
        const text = fields.map(field => field.label + ': ' + field.content).join("\n")
        await Clipboard.setStringAsync(text)
    }

    return (
        <UiScreen
            preset={'profile'}
            modifiers={{}}
        >
            <UiList
                items={fields}
                preset={['rounded']}
                itemPreset={['info']}
                separated={true}
                backgroundColor={'#FFFFFF'}
            />
            <UiBtn
                marginT-20
                label={'Скопировать данные отладки'}
                onPress={onCopyDebug}
                backgroundColor={COLORS.white}
                color={COLORS.primary}
            />
        </UiScreen>
    )
})


const styles = StyleSheet.create({

    bonusCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        overflow: "hidden",
        shadowColor: '#000',
        shadowOffset: {
            width: 2,
            height: 4,
        },
        shadowOpacity: 0.34,
        shadowRadius: 10,
        justifyContent: 'space-between',
        backfaceVisibility: 'hidden',
        elevation: 2,
    },
});

export default AppInfoScreen

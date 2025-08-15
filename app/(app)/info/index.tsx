import React from 'react'
import {StyleSheet} from 'react-native'
import {observer} from 'mobx-react'
import {useFocusEffect, useRouter} from "expo-router"

import {useServices} from '~services'
import {useStores} from '~stores'
import {TScreenProps} from "@core/main/types"
import {UiScreen} from "~ui/screen"
import {UiList} from "~ui/list";
import {COLORS} from "~assets/design";
import {UiListItemProps} from "~ui/list-item";
import {useBottomSheetModal} from "~ui/bottom-sheet-vendor";

export const InfoScreen: React.FC<TScreenProps> = observer(({route: any}) => {


    const {menu} = useStores();
    const {} = useServices();

    const bottomSheetModal = useBottomSheetModal();

    useFocusEffect(() => {
        bottomSheetModal.dismissAll()
    })

    let items: UiListItemProps[] = menu.menuItems.info as UiListItemProps[]

    /*
    const items: any = [
        {
            label: 'Доставка и самовывоз',
            icon: icons.locationsInfo,
            route: '/info/delivery',
        },
        {
            label: 'Вопросы и ответы',
            icon: icons.faq,
            route: '/info/faq',
        },
        {
            label: 'Обратная связь',
            icon: icons.feedback,
            route: '/info/feedback',
        },
        {
            label: 'О приложении',
            icon: icons.infoFaq,
            route: '/info/app-info',
        },
        {
            label: 'Бонусная программа',
            icon: icons.infoFaq,
            route: '/info/page?code=/legal',
        },
    ]

     */

    return (
        <UiScreen
            preset={'default'}
        >
            <UiList
                itemPreset={'menu'}
                preset={'menu'}
                itemProps={{
                    iconProps: {
                        color: COLORS.primaryLight
                    }
                }}
                items={items}
            />
        </UiScreen>
    )
});


const styles = StyleSheet.create({});

export default InfoScreen

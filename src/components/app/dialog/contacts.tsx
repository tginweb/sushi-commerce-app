import React from "react"
import {useStores} from "~stores"
import {observer} from "mobx-react"
import {UiList} from "~ui/list";
import {UiBottomSheet} from "~com/ui/bottom-sheet";
import * as Linking from "expo-linking"
import {TAppContact} from "@core/main/types";
import {UiListItemProps} from "~ui/list-item";
import {View} from "react-native-ui-lib";

type TProps = {}
export const ContactsDialog: React.FC<TProps> = observer(({}) => {

    const {app, page, contactsDialog} = useStores()

    const currentPage = page.getPageByPath('/contacts')
    const pageChunks = currentPage?.chunk || {}

    const contacts = (pageChunks.contacts || []) as UiListItemProps[]

    return (
        <UiBottomSheet
            id={'contacts'}
            isVisible={contactsDialog.visible}
            title="Контакты"
            onClose={() => {
                contactsDialog.hide()
            }}
            preset={'default'}
            backdrop={true}
            enablePanDownToClose={true}
            autoHeight={true}
            stackBehavior={'push'}
        >
            <View marginT-20 marginB-50>
                <UiList
                    itemPreset={['info1']}
                    itemProps={{
                        textPreset: 'text-lg-m-lh1'
                    }}
                    containerStyle={{gap: 10}}
                    items={contacts}
                />
            </View>
        </UiBottomSheet>
    )
})

export default ContactsDialog

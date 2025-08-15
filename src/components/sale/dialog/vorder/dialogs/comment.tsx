import React from "react"
import {StyleSheet} from "react-native"
import {observer} from "mobx-react"
import {useStores} from "~stores"
import {useRouter} from "expo-router"
import {UiBottomSheet} from "~com/ui/bottom-sheet";
import {View} from "react-native-ui-lib";
import {UiTextarea} from "~ui/textarea";


export const VorderCommentDialog: React.FC = observer(() => {


    const {vorder, sale, profileDialog} = useStores()

    return (
        <UiBottomSheet
            id={'comment'}
            isVisible={vorder.dialogs.comment.visible}
            title="Комментарий"
            onClose={() => vorder.vorderDialogClose('comment')}
            closeAction={'Готово'}
            preset={'default'}
            autoHeight={true}
            stackBehavior={'push'}
            keyboardFooterBehavior={'visible'}
        >
            <View marginV-modalV>
                <UiTextarea
                    presets={'outline'}
                    value={vorder.attrValue['USER_DESCRIPTION']}
                    onChangeText={(text) => {
                        vorder.setFieldValue('USER_DESCRIPTION', text)
                    }}
                    numberOfLines={3}
                    style={{
                        minHeight: 100
                    }}
                />
            </View>
        </UiBottomSheet>
    )
})

export default VorderCommentDialog

const styles = StyleSheet.create({})

import React from "react"
import {StyleSheet} from "react-native"
import {observer} from "mobx-react"
import {useStores} from "~stores"
import {UiBottomSheet} from "~com/ui/bottom-sheet";
import {Text} from "react-native-ui-lib";

export const VorderDeliveryDialog: React.FC = observer(() => {

    const {vorder} = useStores()

    return (
        <UiBottomSheet
            id={'delivery'}
            isVisible={vorder.dialogs.delivery.visible}
            title="Доставка"
            onClose={() => vorder.vorderDialogClose('delivery')}
            preset={'default'}
            autoHeight={true}
        >
            <Text>Доставка</Text>
        </UiBottomSheet>
    )
})

export default VorderDeliveryDialog

const styles = StyleSheet.create({})

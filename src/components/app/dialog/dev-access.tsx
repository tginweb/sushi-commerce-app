import React, {useState} from "react"
import {UiBottomSheet} from "~com/ui/bottom-sheet";
import {useStores} from "~stores"
import {observer} from "mobx-react"
import {UiTextField} from "~ui/text-field"
import {View} from "react-native-ui-lib";

type TProps = {}

export const DevAccessModal: React.FC<TProps> = observer(({}) => {

    const {debug} = useStores()
    const [text, setText] = useState('')

    // METHODS

    const onChangeText = (v: string) => {
        setText(v)
        if (v === '3122941') {
            debug.devModeEnable()
            debug.hideAccessModal()
            debug.showDevModal()
        }
    }

    return (
        <UiBottomSheet
            id={'debug'}
            isVisible={debug.devAccessModal.visible}
            title="Debug access"
            onClose={() => {
                debug.hideAccessModal()
            }}
            bodyScrollable={false}
        >
            <View marginV-30 marginH-modalH>
                <UiTextField
                    placeholder='Ключ'
                    floatingPlaceholder
                    presets={'outline'}
                    value={text}
                    onChangeText={onChangeText}
                />
            </View>
        </UiBottomSheet>
    )
})

import React, {useState} from "react"
import {StyleSheet} from "react-native"
import {observer} from "mobx-react"
import {useStores} from "~stores"
import {UiBottomSheet} from "~com/ui/bottom-sheet";
import {Text, View} from "react-native-ui-lib";
import {UiBtn} from "~ui/btn";
import {COLORS} from "~assets/design";
import icons from "~assets/icons-map";
import {UiTextField} from "~ui/text-field";
import {KEYBOARD_BLUR_BEHAVIOR} from "~ui/bottom-sheet-vendor";
import toInt from "@core/main/util/base/toInt";

export const VorderCulteryDialog: React.FC = observer(() => {

    const {vorder} = useStores()

    const [personsNumber, setPersonsNumber] = useState<number>(vorder.personsNumber)

    return (
        <UiBottomSheet
            id={'cultery'}
            isVisible={vorder.dialogs.cultery.visible}
            title="Приборы"
            onClose={() => {
                vorder.setCultery(personsNumber || 1)
                vorder.vorderDialogClose('cultery')
            }}
            closeAction={'Готово'}
            preset={'default'}
            autoHeight={true}
            stackBehavior={'push'}
            keyboardBehavior={'interactive'}
            keyboardBlurBehavior={KEYBOARD_BLUR_BEHAVIOR.none}
            keyboardFooterBehavior={'visible'}

        >
            <Text center marginT-30>Укажите количество приборов</Text>
            <View row centerV centerH marginV-20 style={{gap: 15}}>
                <UiBtn
                    size={'large'}
                    icon={icons.minus}
                    round={true}
                    onPress={() => setPersonsNumber(personsNumber - 1)}
                    outline={true}
                    color={COLORS.grey20}
                    backgroundColor={COLORS.white}
                />
                <UiTextField
                    value={personsNumber ? personsNumber.toString() : ''}
                    onChangeText={(text) => {
                        setPersonsNumber(toInt(text))
                    }}
                    presets={['outline', 'md', 'center']}
                    keyboardType={'numeric'}
                />
                <UiBtn
                    size={'large'}
                    icon={icons.plus}
                    round={true}
                    onPress={() => setPersonsNumber(personsNumber + 1)}
                    outline={true}
                    color={COLORS.grey20}
                    backgroundColor={COLORS.white}
                />
            </View>
        </UiBottomSheet>
    )
})

export default VorderCulteryDialog

const styles = StyleSheet.create({})

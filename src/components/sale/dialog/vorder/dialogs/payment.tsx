import React from "react"
import {StyleSheet} from "react-native"
import {observer} from "mobx-react"
import {useStores} from "~stores"
import {TBottomSheetOnBeforeClose, UiBottomSheet} from "~com/ui/bottom-sheet";
import {Text, View} from "react-native-ui-lib";
import {UiOptions} from "~ui/options";
import {UiListItemProps} from "~ui/list-item";
import {icons, TIconNames} from "~assets/icons-map";
import {messageByRel} from "@core/main/util/base/messageByRel";
import {UiErrorWrapper} from "~ui/error-wrapper";
import {UiSegments} from "~ui/segments";
import {COLORS} from "~assets/design";

export const VorderTimeDialog: React.FC = observer(() => {


    const {vorder} = useStores()

    const options: UiListItemProps[] = vorder.paymentTypeOptions.map((item: any) => ({
        label: item.NAME,
        value: item.VALUE,
        icon: icons[item.ICON as TIconNames],
        iconName: item.ICON,
    }))


    const onBeforeClose: TBottomSheetOnBeforeClose = (fromDismiss, fromAction) => {
        if (vorder.vorderValidate('payment') !== true)
            return fromAction ? false : true
    }

    const messageRel = messageByRel(vorder.validateResult.payment)

    return (
        <UiBottomSheet
            id={'payment'}
            isVisible={vorder.dialogs.payment.visible}
            title="Оплата"
            onBeforeClose={onBeforeClose}
            onClose={() => vorder.vorderDialogClose('payment')}
            preset={'default'}
            autoHeight={true}
            closeAction={'Готово'}
            stackBehavior={'push'}
        >
            <View marginT-20 marginB-20 gap-16>

                <UiErrorWrapper
                    error={messageRel.paymentType}
                    position={'prepend'}
                    preset={'flat'}
                >
                    <UiOptions
                        items={options}
                        preset={['formOptions']}
                        itemPreset={['formOptions']}
                        value={vorder.attrValue['PAYMENT_TYPE']}
                        onChangeValue={(value) => {
                            vorder.setPropValue('PAYMENT_TYPE', value)
                            vorder.vorderValidate('payment')
                        }}
                    />
                </UiErrorWrapper>

                {
                    vorder.attrValue['PAYMENT_TYPE'] === 'cash' &&
                    <UiErrorWrapper
                        error={messageRel.paymentCash}
                        position={'prepend'}
                        preset={'flat'}
                    >
                        <Text marginB-10>Сдача с:</Text>
                        <UiSegments
                            initialValue={vorder.attrValue['CASH_SUM']}
                            activeColor={COLORS.primary}
                            segments={vorder.cashMoneyOptions}
                            segmentsStyle={{
                                paddingHorizontal: 0
                            }}
                            onChangeValue={(v: number) => {
                                vorder.setPropValue('CASH_SUM', v)
                                vorder.vorderValidate('payment')
                            }}
                        />
                    </UiErrorWrapper>
                }
            </View>
        </UiBottomSheet>
    )
})

export default VorderTimeDialog

const styles = StyleSheet.create({})

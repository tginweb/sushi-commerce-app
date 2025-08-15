import React, {useMemo} from "react"
import {StyleSheet} from "react-native"
import {observer} from "mobx-react"
import {useStores} from "~stores"
import {UiBottomSheet} from "~com/ui/bottom-sheet";
import {Text, View} from "react-native-ui-lib";
import {COLORS} from "~assets/design";
import {useAttrsView} from "~com/sale/dialog/vorder/hooks";
import {UiSection} from "~ui/section";
import {UiList} from "~ui/list";
import {BasketItem} from "~com/sale/basket-item";
import {UiBtnProps} from "~ui/btn";
import {MapYandex} from "~com/geo/map-yandex";
import {GeoMarker} from "@core/geo/class/GeoMarker";
import {GeoMarkerHome} from "@core/geo/class/GeoMarkerHome";

export const VorderConfirmDialog: React.FC = observer(() => {

    const {vorder} = useStores()

    const attrsView = useAttrsView()

    const footerActions = useMemo(() => {
        const res: UiBtnProps[] = []

        res.push({
            label: 'Назад',
            outline: true,
            color: COLORS.primary,
            onPress: () => vorder.dialogs.confirm.hide()
        })

        res.push({
            label: 'Подтвердить заказ',
            containerStyle: {
                flexGrow: 1
            },
            onPress: () => {
                vorder.dialogs.confirm.onSuccess()
                vorder.dialogs.confirm.hide()
            }
        })

        return res
    }, [])


    const markers = useMemo(() => {

        const res: GeoMarker[] = []

        if (vorder.isTransportCourier) {
            if (vorder.mapCoords) {
                res.push(new GeoMarkerHome('place', vorder.mapCoords))
            }
        } else {

        }

        return res
    }, [vorder.attrValue['HOUSE_COORDS'], vorder.attrValue['STREET_COORDS']])

    console.log({
        STREET_COORDS: vorder.attrValue['STREET_COORDS'],
        HOUSE_COORDS: vorder.attrValue['HOUSE_COORDS'],
        mapCoords: vorder.mapCoords,
        markers
    })

    return (
        <UiBottomSheet
            id={'payment'}
            isVisible={vorder.dialogs.confirm.visible}
            onClose={() => vorder.vorderDialogClose('confirm')}
            ///title="Подтвержение заказа"
            preset={'default'}
            footerActions={footerActions}
            footerActionsContainerStyle={{
                flexDirection: 'row',
                gap: 11
            }}
            stackBehavior={'push'}
            title={'Проверьте и подтвердите заказ'}
        >
            <View marginT-20 marginB-20 gap-12>

                <UiSection
                    headerTitle={'Состав заказа'}
                    preset={['filled']}
                >
                    {vorder.basketItemsCalculated.map((item: any, index: number) => (
                        <BasketItem
                            paddingV-10
                            key={index}
                            item={item}
                            last={index === vorder.basketItems.length - 1}
                            readonly={true}
                        />
                    ))}
                </UiSection>

                <UiSection
                    headerTitle={vorder.isTransportCourier ? 'Доставка' : 'Самовывоз'}
                    preset={['filled']}
                >
                    <UiList
                        items={attrsView.delivery}
                        itemPreset={['fields']}
                        itemProps={{
                            textPreset: 'text-md-r',
                        }}
                    />
                </UiSection>

                <UiSection
                    headerTitle={'Оплата'}
                    preset={['filled']}
                >
                    <UiList
                        items={attrsView.payment}
                        itemPreset={['fields']}
                        itemProps={{
                            textPreset: 'text-md-r',
                        }}
                    />
                </UiSection>

                <UiSection
                    headerTitle={'Детали'}
                    preset={['filled']}
                >
                    <UiList
                        items={attrsView.other}
                        itemPreset={['fields']}
                        itemProps={{
                            textPreset: 'text-md-r',
                        }}
                    />
                </UiSection>


            </View>
        </UiBottomSheet>
    )
})

export default VorderConfirmDialog

const styles = StyleSheet.create({})

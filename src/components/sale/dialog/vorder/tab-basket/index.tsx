import React, {useCallback, useEffect, useMemo, useState} from "react"
import {StyleSheet} from "react-native"
import {observer} from "mobx-react"
import {Text, View} from "react-native-ui-lib"
import {BasketItem} from "~com/sale/basket-item"
//import {ProductCardOffer} from "~com/catalog/product/card/offer"
import {useStores} from "~stores";
import {UiBtn, UiBtnProps} from "~ui/btn";
import {icons} from "~assets/icons-map"
import {TValidatableComponentHandle} from "@core/main/types";
import {COLORS} from "~assets/design";
import {useWatch} from "@core/main/lib/hooks/useWatch";
import {TabBasketUpsales} from "./block/upsales";
import {SectionBenefitType, SectionDiscount} from "~com/sale/dialog/vorder/section";
import {UiSegments} from "~ui/segments";
import Summary from "~com/sale/dialog/vorder/summary";
import {TBasketItemCalculated} from "@core/sale/types";

interface TProps {
    active: boolean
    onSetActions: (actions: UiBtnProps[]) => void
    onSetTab: (tab: string) => void
}

export const TabBasket: React.FC<TProps> = observer(({onSetActions, onSetTab, active}) => {

    const {vorder, catalog, router} = useStores()

    const refs = {
        delivery: React.useRef<TValidatableComponentHandle>(),
        pickup: React.useRef<TValidatableComponentHandle>(),
        time: React.useRef<TValidatableComponentHandle>(),
        benefit_type: React.useRef<TValidatableComponentHandle>(),
        discount: React.useRef<TValidatableComponentHandle>(),
        bonus: React.useRef<TValidatableComponentHandle>(),
        promo: React.useRef<TValidatableComponentHandle>(),
    }

    const actions = useMemo<UiBtnProps[]>(() => {
        const res: UiBtnProps[] = []
        if (vorder.basketNotEmpty) {

            /*
            res.push({
                icon: icons.del,
                link: true,
                color: COLORS.primary,
                iconSize: 20,
                onPress: () => vorder.basketOp({action: 'clear'}),
                confirm: {
                    title: 'Очистить корзину?'
                },
                containerStyle: {flex: 1},
                buttonStyle: {flex: 1, alignSelf: 'stretch'}
            })

             */

            res.push({
                label: 'Перейти к оформлению',
                backgroundColor: COLORS.primary,
                outline: false,
                onPress: () => onSetTab('order'),
                containerStyle: {
                    flex: 6
                },
            })
        }
        return res
    }, [vorder.priceTotal, vorder.basketNotEmpty])

    useEffect(() => {
        if (active)
            onSetActions(actions)
    }, [active, actions])

    const [benefitTypeState, setBenefitTypeState] = useState(() => vorder.benefitType)

    useWatch(() => {
        setTimeout(() => {
            setBenefitTypeState(vorder.benefitType)
        }, 300)
    }, [vorder.benefitType])

    const itemsCount = vorder.basketItemsCalculated.length

    const renderBasketItem = useCallback((item: TBasketItemCalculated, index: number) => {
        return <BasketItem
            showDiscount={true}
            paddingV-10
            paddingR-12
            paddingL-6
            item={item}
            key={item.model.ID}
            last={index + 1 === itemsCount}
            first={index === 0}
        />
    }, [itemsCount])

    const keyExtractor = useCallback((item: TBasketItemCalculated, index: number) => {
        return item.model.ID.toString()
    }, [])

    return <View marginT-18 marginB-24 flex>
        {vorder.basketNotEmpty ?
            <View gap-15>
                <View gap-15 style={{minHeight: 200}}>
                    <View paddingH-12 marginB-5>
                        <UiSegments
                            segments={vorder.deliveryOptions}
                            activeColor={COLORS.primary}
                            activeBackgroundColor={COLORS.white}
                            value={vorder.attrValue['DELIVERY_ID']}
                            onChangeValue={(v: any) => vorder.deliveryTabChange(v)}
                            throttleTime={400}
                        />
                    </View>
                    <View>
                        {vorder.basketItemsCalculated.map((item, index) => renderBasketItem(item, index))}
                        <TabBasketUpsales/>
                    </View>
                </View>

                <View gap-15>
                    <SectionBenefitType
                        marginH-14
                        ref={refs.benefit_type}
                        showCaption={vorder.basketItemsCalculated.length < 5}
                    />

                    <Summary
                        paddingH-16
                        showBenefit={true}
                        showDelivery={true}
                        showBasket={true}
                        showAddress={false}
                        style={{marginTop: -7}}
                    />

                    <UiBtn
                        color={COLORS.red40}
                        icon={icons.del}
                        label={'очистить корзину'}
                        link={true}
                        iconSize={15}
                        text-md
                        onPress={() => {
                            vorder.clear()
                        }}
                        confirm={{
                            title: 'Очистить корзину?'
                        }}
                    />
                </View>

            </View>
            :
            <View paddingH-16 paddingT-20 style={{minHeight: 300}}>
                <View gap-15 flex>
                    <View centerH gap-10>
                        {icons.cart({color: COLORS.grey20, size: 60})}
                        <Text font-size-md>Корзина пуста</Text>
                        <UiBtn
                            label={'Перейти в каталог'}
                            size={'large'}
                            onPress={() => {
                                vorder.hideBasketModal()
                                catalog.navCatalogPage()
                            }}
                        />
                    </View>
                    <View paddingT-10 style={{marginTop: 'auto'}}>
                        <UiSegments
                            segments={vorder.deliveryOptions}
                            activeColor={COLORS.primary}
                            value={vorder.attrValue['DELIVERY_ID']}
                            onChangeValue={(v: any) => vorder.deliveryTabChange(v)}
                            throttleTime={400}
                        />
                        <SectionDiscount
                            ref={refs.discount}
                            marginT-14
                        />
                    </View>
                </View>
            </View>
        }
    </View>
})

export default TabBasket

const styles = StyleSheet.create({

    sectionGroup: {
        //backgroundColor: '#F7F7F7',
        borderRadius: 9,
        borderWidth: 0,
        borderColor: '#BBBBBB',
    },

})

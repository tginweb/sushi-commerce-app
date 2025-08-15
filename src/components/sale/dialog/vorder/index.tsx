import React, {useCallback, useEffect, useState} from "react"
import {StyleSheet} from "react-native"
import {observer} from "mobx-react"
import {useStores} from "~stores"
import {UiTabBar, UiTabController, UiTabPage, UiTabPageCarouselGesture, useTabs} from "~ui/tabs";
import {useServices} from "~services"
import {TBottomSheetOnClose, TTopbarSlotProps, UiBottomSheet, UiBottomSheetMethods} from "~com/ui/bottom-sheet";
import TabBasket from "./tab-basket";
import TabOrder from "./tab-order";
import {wWidth} from "~assets/design";
import {UiBtnProps} from "~ui/btn";
import {Text, View} from "react-native-ui-lib";

interface TProps {

}

export const BasketModal: React.FC<TProps> = observer(({}) => {

    const {vorder, router: routerStore, catalog} = useStores()
    const {catalogUtil, bus} = useServices()

    const [actions, setActions] = useState<UiBtnProps[]>([])

    type TabValueEnum = 'basket' | 'order'

    const refs = {
        sheet: React.useRef<UiBottomSheetMethods>(null as any),
    }

    const tabs = useTabs<TabValueEnum>({
        value: 'basket',
        items: [
            {label: 'Корзина', value: 'basket'},
            {label: 'Заказ', value: 'order'},
        ],
    })

    const onSetActions = (items: UiBtnProps[]) => {
        setActions(items)
    }

    const footerSlot = () => {
        return <></>
    }

    useEffect(() => {

        setTimeout(() => {
            refs.sheet.current?.scrollTo(0, false)
        }, 300)
    }, [tabs.activeValue])

    useEffect(() => {

        bus.emitter.on('modal:vorder:changeTab', onChangeTab)
        return () => {
            bus.emitter.off('modal:vorder:changeTab', onChangeTab)
        }
    }, [])

    const renderPrice = () => {
        return <View
            flex gap-3 centerH centerV
            style={{borderWidth: 0, borderColor: '#AAAAAA', borderRadius: 14, minWidth: 55}}
        >
            <Text text-xs-m-lh0>К оплате</Text>
            <Text text-lg-bo-lh0 primary>{catalogUtil.formatPriceCurrency(vorder.pricePay)}</Text>
        </View>
    }

    const onShow = () => {
        vorder.onVorderDialogOpened(tabs.activeValue)
    }

    const onChangeTab = (tab: TabValueEnum, force: boolean = false) => {
        tabs.changeTab(tab)
    }


    const onClose: TBottomSheetOnClose = (fromDismiss) => {

        let routerBack = true

        if (vorder.basketCloseReason === 'redirect') {
            vorder.basketCloseReasonReset()
            routerBack = false
        }

        onChangeTab('basket')

        routerBack && routerStore.back()

        if (fromDismiss) {
            vorder.hideBasketModal()
            return;
        }
        if (tabs.activeValue === 'basket') {
            vorder.hideBasketModal()
        }
    }

    const onScrollBeginDrag = useCallback(() => {
        catalog.disableOpen('swipe')
    }, [])

    const onScrollEndDrag = useCallback(() => {
        catalog.enableOpen()
    }, [])

    const topbarInnerSlot = ({closerSlot}: TTopbarSlotProps) => {
        return <>
            <View style={{alignSelf: 'flex-end'}} flex>
                <UiTabController
                    items={tabs.items}
                    onChangeValue={tabs.changeTab}
                    value={tabs.activeValue}
                >
                    <UiTabBar
                        preset={'normal'}
                        height={30}
                        enableShadow={false}
                        spreadItems={true}
                        containerWidth={wWidth - 50}
                        backgroundColor={'transparent'}
                    />
                </UiTabController>
                <View style={{width: 28, zIndex: 1000, right: 0, top: -8, position: 'absolute'}}>
                    {closerSlot && closerSlot({style: {marginLeft: 'auto'}})}
                </View>
            </View>
        </>
    }

    return (
        <UiBottomSheet
            id={'basket'}
            isVisible={vorder.basketModal.visible}
            ref={refs.sheet}
            title="Корзина"
            onClose={onClose}
            onShow={onShow}
            loading={vorder.updatingForm}
            preset={'default'}
            targetModifiers={{
                scroll: [],
                //footer: ['paddingH-10', 'paddingB-modalH']
            }}
            footerPrependSlot={footerSlot}
            footerActions={actions}
            footerActionsContainerStyle={{gap: 10, flexDirection: 'row'}}
            footerActionsPrependSlot={renderPrice()}
            scrollToInput={500}
            topbarInnerSlot={vorder.basketNotEmpty ? topbarInnerSlot : undefined}
            stackBehavior={'push'}
            topInsetAdd={true}
        >
            <UiTabController
                ref={tabs.ref as any}
                items={tabs.items}
                onChangeValue={tabs.onChangeValue}
                initialValue={tabs.activeValue}
                asCarousel={true}
                changeOnBefore={true}
            >
                <UiTabPageCarouselGesture
                    onScrollBeginDrag={onScrollBeginDrag}
                    onScrollEndDrag={onScrollEndDrag}
                >
                    <UiTabPage index={0}>
                        <TabBasket
                            active={tabs.activeValue === 'basket'}
                            onSetActions={onSetActions}
                            onSetTab={onChangeTab as any}
                        />
                    </UiTabPage>
                    <UiTabPage index={1}>
                        <TabOrder
                            active={tabs.activeValue === 'order'}
                            onSetActions={onSetActions}
                            onSetTab={onChangeTab as any}
                            onClose={() => vorder.hideBasketModal()}
                        />
                    </UiTabPage>
                </UiTabPageCarouselGesture>
            </UiTabController>
        </UiBottomSheet>
    )
})

export default BasketModal

const styles = StyleSheet.create({})

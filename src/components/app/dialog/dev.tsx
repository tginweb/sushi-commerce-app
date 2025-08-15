import React, {useEffect, useState} from "react"
import {Checkbox, TabController, TabControllerItemProps, Text, View} from "react-native-ui-lib"
import {UiBtn} from "~ui/btn"
import JSONTree from "react-native-json-tree"
import {useStores} from "~stores"
import {observer} from "mobx-react"
import {usePathname} from "expo-router"
import {Select} from "~ui/select-pro"
import {useServices} from "~services"
import {UiBottomSheet} from "~com/ui/bottom-sheet";
import {Image} from 'expo-image';
import {COLORS} from "~assets/design";
import {UiSegments} from "~ui/segments";
import {deepGet} from "@core/main/util/base";
import ExpoCheckbox from 'expo-checkbox';
import {UiDebugFields} from "~ui/debug-field";
import {getPersistedStore} from 'mobx-persist-store';
import {NoticeModel} from "@core/notice/model/Notice";
import {ScrollView} from "react-native";

type TProps = {}

const TabStore = React.memo(() => {

    const {
        settings,
        main,
        router: routerStore,
        push,
        catalogConstructor,
        offer,
        menu,
        notice,
        page,
        fav,
        company,
        sale,
        vorder,
        user,
        catalog,
        promo,
        faq,
        ui,
        debug,

    } = useStores()

    const debugData = {
        push,
        user,
        currentRoute: routerStore.currentRoute,
        catalog,
        catalogConstructor,
        company,
        page,
        offer,
        notice,
        //catalogConstructor: catalog.constructorSectionsTree,
        sale,
        fav,
        faq,
        vorder: {
            attrValue: vorder.attrValue,
            basketItems: vorder.basketItems,
            DELIVERIES: vorder.form.DELIVERIES,
            deliveryDuration: vorder.deliveryDuration,
            deliveryDurationByProfile: vorder.deliveryDurationByProfile,
        },
        debug: {
            eventsTransportConfig: debug.eventsTransportConfig,
            consolePanelItems: debug.consolePanelItems
        },
        settings,
        menu,
        benefitType: vorder.benefitType,
        basketItems: vorder.basket.ITEMS,
        promo: promo
    }

    return <ScrollView style={{flex: 1}}>
        <JSONTree
            data={debugData}
            theme={{}}
        />
    </ScrollView>
})

export const DevModal: React.FC<TProps> = observer(({}) => {

    const [screenEvent, setScreenEvent] = useState<string | null>(null)

    const stores = useStores()

    const {
        router,
        vorder,
        user,
        debug,
        sale,
        notice,
        push
    } = stores

    const {bus, config, websocket} = useServices()

    const currentUrl = usePathname()

    const [logDeliveryTypeState, setLogDeliveryTypeState] = useState('server')
    const [persistedState, setPersistedState] = useState<any>({})

    const loadPersistedStores = async () => {
        const state: any = {}
        for (const [storeName, store] of Object.entries(stores)) {
            const storePersistedValues = await getPersistedStore(store)
            if (storePersistedValues) {
                state[storeName] = storePersistedValues
            }
        }
        setPersistedState(state)
    }

    useEffect(() => {

        loadPersistedStores()
    })


    const slotBody = <View flex>
        <TabController
            items={[
                {label: 'Общее'}, // 0
                {label: 'Юзер'}, // 1
                {label: 'Роутинг'}, // 2
                {label: 'Лог'}, // 3
                {label: 'Вебсокет'}, // 4
                {label: 'Фото'}, // 5
                {label: 'UI'}, // 6
                {label: 'Store'}, // 7
                {label: 'Persist store'}, // 8
                {label: 'Нотисы'}, // 9
            ] as TabControllerItemProps[]}
            initialIndex={9}
        >
            <TabController.TabBar
                height={32}
                containerStyle={{
                    height: 32
                }}
            />

            <View flex marginT-16 style={{minHeight: 400}}>

                <TabController.TabPage index={0}>

                    <View marginH-modalH gap-15>

                        <Checkbox
                            value={debug.adminMode}
                            onValueChange={() => {
                                debug.adminModeToggle()
                            }}
                            label={'Режим администрирования'}
                        />

                        <Checkbox
                            value={debug.consoleLogEnable}
                            onValueChange={() => {
                                debug.consoleLogEnableToggle()
                            }}
                            label={'Консоль мониторинг событий'}
                        />

                        <View marginT-20>
                            <UiBtn
                                label={'Выключить режим рарзработчика'}
                                confirm={{
                                    title: 'Выключить режим разработчика?'
                                }}
                                onPress={() => {
                                    debug.devModeDisable()
                                    debug.hideDevModal()
                                }}
                            />
                        </View>

                    </View>

                </TabController.TabPage>

                <TabController.TabPage index={1} lazy>

                    <View paddingH-modalH>

                        <UiDebugFields
                            items={[
                                {
                                    label: 'Client ID',
                                    value: user.clientId,
                                },
                                {
                                    label: 'Session ID',
                                    value: user.sessionId,
                                },
                                {
                                    label: 'Fuser ID',
                                    value: user.fuserId,
                                },
                                {
                                    label: 'User ID',
                                    value: user.userId,
                                },
                                {
                                    label: 'Access Token',
                                    value: user.token,
                                },
                                {
                                    label: 'Push Token',
                                    value: push.pushToken,
                                },
                                {
                                    label: 'VOrder ID',
                                    value: vorder.vorderId,
                                },
                            ]}
                        />

                        <View marginT-20 gap-10>

                            <View row gap-10>
                                <UiBtn
                                    size={'xSmall'}
                                    flex-5
                                    label={'Стереть сессию'}
                                    onPress={() => user.resetSession()}
                                />
                                <UiBtn
                                    size={'xSmall'}
                                    flex-5
                                    label={'Стереть ClientId'}
                                    onPress={() => user.resetClientId()}
                                />
                            </View>

                            <UiBtn
                                label={'Cинхрон корзины'}
                                onPress={() => {
                                    vorder.apiMutateApply({})
                                }}
                                loading={vorder.apiMutateApply.pending}
                            />

                        </View>
                    </View>

                </TabController.TabPage>

                <TabController.TabPage index={2} lazy>

                    <View marginH-modalH gap-15>

                        <View>
                            <Select
                                inputProps={{}}
                                onSelect={(option) => {
                                    bus.emitter.emit('app.root.changeMode', option.value)
                                }}
                                placeholderText={'App mode'}

                                styles={{
                                    optionsList: {
                                        maxHeight: 300
                                    }
                                }}
                                options={[
                                    {
                                        label: 'loading',
                                        value: 'loading',
                                    },
                                    {
                                        label: 'app_disable',
                                        value: 'app_disable',
                                    },
                                    {
                                        label: 'need_update',
                                        value: 'need_update',
                                    },
                                    {
                                        label: 'normal',
                                        value: 'normal',
                                    },

                                    {
                                        label: 'loading',
                                        value: 'loading1',
                                    },
                                    {
                                        label: 'app_disable',
                                        value: 'app_disable2',
                                    },
                                    {
                                        label: 'need_update',
                                        value: 'need_update3',
                                    },
                                    {
                                        label: 'normal',
                                        value: 'normal4',
                                    },
                                    {
                                        label: 'loading',
                                        value: 'loading5',
                                    },
                                    {
                                        label: 'app_disable',
                                        value: 'app_disable6',
                                    },
                                    {
                                        label: 'need_update',
                                        value: 'need_update7',
                                    },
                                    {
                                        label: 'normal',
                                        value: 'normal8',
                                    },
                                    {
                                        label: 'loading',
                                        value: 'loading9',
                                    },
                                    {
                                        label: 'app_disable',
                                        value: 'app_disable10',
                                    },
                                    {
                                        label: 'need_update',
                                        value: 'need_update11',
                                    },
                                    {
                                        label: 'normal',
                                        value: 'normal12',
                                    },
                                ]}

                                searchable={true}
                            />
                        </View>

                        <View row>
                            <View flexG>
                                <Text>
                                    Стартовый адрес:
                                </Text>
                                <Text>
                                    {!debug.initialRoute ? 'нет' : debug.initialRoute}
                                </Text>
                            </View>
                            <View row style={{gap: 10}}>
                                <UiBtn label={'Установить'} size={'small'} outline onPress={() => {
                                    debug.setInitialRoute(currentUrl)
                                }}/>
                                <UiBtn label={'Снять'} size={'small'} outline onPress={() => {
                                    debug.setInitialRoute(null)
                                }}/>
                            </View>
                        </View>
                        <View style={{gap: 10}}>


                        </View>
                    </View>

                </TabController.TabPage>

                <TabController.TabPage index={3} lazy>

                    <View paddingH-12 paddingB-14 gap-20>
                        <Checkbox
                            value={debug.consoleLogOverlay}
                            onValueChange={() => {
                                debug.consoleLogOverlayToggle()
                            }}
                            label={'Консоль оверлей'}
                        />
                        <UiSegments
                            segments={debug.deliveryChannels.map(item => ({
                                label: item.name,
                                value: item.name,
                            }))}
                            activeColor={COLORS.primary}
                            value={logDeliveryTypeState}
                            onChangeValue={setLogDeliveryTypeState}
                            throttleTime={400}
                        />
                    </View>

                    <View flex marginH-12 marginB-12 gap-10>
                        <View row centerV>
                            <View flex-5>
                                <Text>Канал</Text>
                            </View>
                            {debug.eventTypes.map(eventType =>
                                <View flex-3 row gap-4 key={eventType.name} padding-6>
                                    <Text>{eventType.name}</Text>
                                </View>
                            )}
                        </View>
                        <View row centerV>
                            <View flex-5>
                                <Text>Все</Text>
                            </View>
                            {debug.eventTypes.map(eventType => {
                                const path = [logDeliveryTypeState, 'all', eventType.name]
                                const val = deepGet(debug.eventsTransportConfig, path)
                                return <View
                                    flex-3 row gap-4
                                    key={eventType.name}
                                    padding-6
                                >
                                    <ExpoCheckbox
                                        value={val}
                                        onValueChange={() => debug.setEventsTransportConfigItem(path, !val)}
                                    />
                                </View>
                            })}
                        </View>

                        {debug.eventScopes.map(channel =>
                            <View row key={channel.name} centerV>
                                <View flex-5>
                                    <Text>{channel.name}</Text>
                                </View>
                                {debug.eventTypes.map(eventType => {
                                    const path = [logDeliveryTypeState, channel.name, eventType.name]
                                    const val = deepGet(debug.eventsTransportConfig, path)
                                    const disabled = deepGet(debug.eventsTransportConfig, [logDeliveryTypeState, 'all', eventType.name]) || false
                                    return <View flex-3 row gap-4 key={eventType.name} padding-6>
                                        <ExpoCheckbox
                                            value={val}
                                            onValueChange={() => debug.setEventsTransportConfigItem(path, !val)}
                                            disabled={disabled}
                                        />
                                    </View>
                                })}
                            </View>
                        )}
                    </View>

                </TabController.TabPage>

                <TabController.TabPage index={4} lazy>

                    <View marginT-20 marginH-modalH>
                        <UiBtn
                            label={'Отравить тест событие ОРДЕРА'}
                            onPress={() => {
                                websocket.sendMessage({
                                    name: 'test.order.next-status',
                                    data: {
                                        cont: 'aa',
                                        orderId: sale.userActiveOrderId
                                    }
                                })
                            }}
                        />
                    </View>

                </TabController.TabPage>

                <TabController.TabPage index={5} lazy>

                    <View paddingH-modalH gap-10>
                        <UiBtn label={'Стереть картинки'} size={'small'} outline onPress={async () => {
                            await Image.clearDiskCache()
                            await Image.clearMemoryCache()
                        }}/>
                    </View>

                </TabController.TabPage>

                <TabController.TabPage index={6} lazy>

                    <View row>
                        <View flexG>
                            <Select
                                inputProps={{}}
                                onSelect={(option) => {
                                    setScreenEvent(option.value as string)
                                }}
                                placeholderText={'App mode'}
                                options={[
                                    {
                                        label: 'reload',
                                        value: 'reload',
                                    },
                                ]}
                                searchable={true}
                            />
                        </View>
                        <View row style={{gap: 10}}>
                            <UiBtn
                                onPress={() => {
                                    bus.emitter.emit('screen.' + screenEvent)
                                }}
                            />
                        </View>
                    </View>


                </TabController.TabPage>

                <TabController.TabPage index={7} lazy>
                    <TabStore/>
                </TabController.TabPage>

                <TabController.TabPage index={8} lazy>
                    <JSONTree
                        data={persistedState}
                        theme={{}}
                    />
                </TabController.TabPage>

                <TabController.TabPage index={9} lazy>

                    <View marginH-modalH gap-15>
                        <UiBtn
                            label={'Тест нотис'}
                            onPress={() => {
                                const newNoticeId = debug.incNewNoticeId()
                                notice.mergeNotice({
                                    id: newNoticeId,
                                    title: 'Тест заголовок',
                                    message: 'Тест сообщение',
                                    body: 'Тест бади',
                                    createdAt: Date.now() / 1000,
                                    targetCode: 'individual'
                                } as NoticeModel)
                            }}
                        />
                        <UiBtn
                            label={'Сделать все непрочитанными'}
                            onPress={() => notice.setNoticeUnreadedAll()}
                        />
                    </View>

                </TabController.TabPage>

            </View>

        </TabController>
    </View>

    return (
        <UiBottomSheet
            id={'debug'}
            isVisible={debug.devModal.visible}
            enableContentPanningGesture={false}
            title="Debug"
            bodySlot={slotBody}
            autoHeight={false}
            snapPoints={['100%']}
            onClose={() => {
                debug.hideDevModal()
            }}
            bodyScrollable={false}
            noScrollView={true}
        />
    )
})

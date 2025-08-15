import React, {useCallback, useEffect, useMemo, useRef, useState} from "react"
import {useStores} from "~stores"
import {observer} from "mobx-react"
import {Text, View} from "react-native-ui-lib";
import {COLORS, SPACE, TYPOGRAPHY} from "~assets/design";
import {LayoutChangeEvent, ListRenderItem, StyleSheet, TouchableWithoutFeedback, ViewToken} from "react-native";

import toArray from "@core/main/util/base/toArray"
import JSONTree from "react-native-json-tree";
import {UiBtn} from "~ui/btn";
import icons from "~assets/icons-map";
import Reanimated, {useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import {FlatList, TouchableOpacity} from "react-native-gesture-handler";
import {TTabControllerItemProps, useTabs} from "~ui/tabs";
import {TabBarStandalone} from "~ui/tab-view/TabBarStandalone";
import {UiActions} from "~ui/actions";
import {UiBadge} from "~ui/badge";
import {TDebugEventScope, TDevConsolePanelItem} from "@core/main/types";
import {Record} from "immutable";
import {messageTypes} from "~ui/message/styles";
import {generate} from "random-words";
import {UiSegments} from "~ui/segments";
import {Case, Switch} from 'react-if';

type DevConsolePanelProps = {
    height: number
    focused: boolean
    onFocus?: () => void
    backgroundColor?: string
}

export const DevConsolePanel: React.FC<DevConsolePanelProps> = observer((props) => {

    const {
        height,
        focused,
        onFocus,
        backgroundColor = '#00000099'
    } = props

    const {debug} = useStores()
    const [selectedItem, setSelectedItem] = useState<TDevConsolePanelItem | null>()
    const [version, setVersion] = useState<number>(0)

    const listRef = useRef<FlatList>(null as any)

    const keyExtractor = useCallback((event: TDevConsolePanelItem, index: number) => {
        return event.uid
    }, [])

    const onPressItem = useCallback((item: TDevConsolePanelItem) => {
        if (selectedItem !== item) {
            setSelectedItem(item)
        } else {
            setSelectedItem(null)
        }
    }, [selectedItem])

    const renderItem = useCallback<ListRenderItem<TDevConsolePanelItem>>((info) => {

        const {item} = info

        const itemStyle = itemsStyle[item.event.type]

        let opacity
        const selected = selectedItem === item

        if (selected) {
            opacity = 1
        } else if (focused) {
            opacity = 0.6
        } else {
            opacity = 0.6
        }

        return <TouchableOpacity
            activeOpacity={0.9}
            style={[
                styles.item,
                selected && styles.itemSelected,
                {
                    backgroundColor: 'rgba(' + itemStyle.rgb + ', ' + opacity + ')'
                },
            ]}
            onPress={() => onPressItem(item)}
        >
            <View gap-4>

                <View gap-5 row style={{flexWrap: 'nowrap'}}>

                    {!!item.event.message &&
                        <View flexS>
                            <Text
                                style={[
                                    styles.itemMessage,
                                ]}
                                white
                            >
                                {item.event.message}
                            </Text>
                        </View>
                    }

                    <View gap-4 row centerV style={{marginLeft: 'auto'}}>
                        <Text text-4xs-m-lh1 white>#{info.index + 1}</Text>
                        {
                            toArray(item.event.scope).map((channel) =>
                                <View key={channel} style={styles.itemChannel}>
                                    <Text style={styles.itemChannelText} white>
                                        {item.event.scope}
                                    </Text>
                                </View>
                            )
                        }
                    </View>
                </View>
                {!!item.dataFormatted && <Text style={styles.itemData} white>
                    {item.dataFormatted} {SPACE}
                </Text>}
            </View>
        </TouchableOpacity>
    }, [selectedItem, focused])

    const jsonHeight = useSharedValue(0)

    const onJsonLayout = useCallback((event: LayoutChangeEvent) => {
        jsonHeight.value = withTiming(event.nativeEvent.layout.height + 12 * 2, {duration: 100})
    }, [])

    const animStyles = useAnimatedStyle(() => {

        const max = height / 2 - 30
        return {
            height: jsonHeight.value > max ? max : jsonHeight.value
        }
    }, [height])

    const itemsCount = debug.consolePanelItems.length

    const onViewableItemsChanged = useCallback(({viewableItems}: {
        viewableItems: Array<ViewToken>;
        changed: Array<ViewToken>;
    }) => {
        setTimeout(() => {
            debug.consolePanelItemsRead(viewableItems.map(item => item.item.uid))
        }, 2000)
    }, [])


    const tabs = useTabs<TDebugEventScope>({
        value: 0,
        items: useMemo(() => {
            const res: TTabControllerItemProps[] = debug.eventScopes.map((scope) => {
                return {
                    label: scope.name,
                    value: scope.name,
                    data: debug.consoleStat.scopes[scope.name] || {
                        count: 0,
                        countByType: {}
                    }
                } as TTabControllerItemProps
            })
            res.unshift({
                label: 'Все события',
                value: 0,
                data: {
                    count: debug.consolePanelItems.length,
                    countByType: debug.consoleStat.countByType
                }
            } as TTabControllerItemProps)
            return res
        }, [debug.consoleStat, debug.consoleItemsVersion]),
    })

    const itemsFiltered = useMemo(() => {
        return debug.consolePanelItems.filter(item => {
            return !tabs.activeValue || toArray(item.event.scope).indexOf(tabs.activeValue) > -1
        })
    }, [debug.consoleItemsVersion, tabs.activeValue, version])

    const itemsFilteredCount = itemsFiltered.length

    useEffect(() => {

        setTimeout(() => {
            const firstUnreadedItemIndex = itemsFiltered.findIndex(item => !item.readed)

            if (firstUnreadedItemIndex > -1) {
                try {
                    if (!selectedItem)
                        listRef.current?.scrollToEnd({
                            animated: true,
                        })

                    /*
                    listRef.current?.scrollToIndex({
                        index: firstUnreadedItemIndex,
                        animated: true,
                        viewPosition: 1
                    })

                     */
                } catch (e) {

                }
            }
        }, 200)

    }, [itemsFilteredCount])

    const [mode, setMode] = useState('scopes')

    const otherTabs = useTabs<'render' | 'second'>({
        items: [
            {
                label: 'Render',
                value: 'render'
            },
            {
                label: 'Second',
                value: 'second'
            },
        ]
    })

    return <View style={[styles.box, {backgroundColor: backgroundColor}]}>

        <TouchableWithoutFeedback
            onPressIn={() => onFocus && onFocus()}
        >
            <View row gap-10 bg-grey50 paddingV-7>
                <View paddingH-10 row gap-6>
                    <Text text-xs-bo>Console</Text>

                    <UiSegments
                        initialValue={mode}
                        onChangeValue={(v: any) => {
                            setMode(v)
                        }}
                        segments={[
                            {
                                label: 'scopes',
                                value: 'scopes'
                            },
                            {
                                label: 'other',
                                value: 'other'
                            },
                        ]}
                        activeColor={COLORS.primary}
                        value={'scopes'}
                        throttleTime={400}
                        segmentLabelStyle={{
                            ...TYPOGRAPHY["text-xs-lh0"]
                        }}
                        segmentsStyle={{
                            paddingHorizontal: 5,
                            paddingVertical: 2
                        }}
                    />

                </View>
                <View marginL-auto>
                    <UiActions
                        items={[
                            {
                                icon: icons.star,
                                link: true,
                                onPress: () => {

                                    const eventType = debug.eventTypes[Math.floor(debug.eventTypes.length * Math.random())]
                                    const eventScope = debug.eventScopes[Math.floor(debug.eventScopes.length * Math.random())]
                                    debug.pushEvent({
                                        type: eventType.name,
                                        scope: eventScope.name,
                                        message: toArray(generate(5)).join(' '),
                                    })
                                }
                            },
                            {
                                icon: icons.del,
                                link: true,
                                onPress: () => {
                                    debug.consolePanelClear()
                                }
                            },
                            {
                                icon: icons.refresh,
                                link: true,
                                onPress: () => {
                                    setVersion(version + 1)
                                }
                            },
                            {
                                icon: debug.consolePanelFullscreen ? icons.bars : icons.check,
                                link: true,
                                onPress: () => {
                                    debug.consolePanelFullscreenToggle()
                                }
                            },
                            {
                                icon: icons.cancel,
                                link: true,
                                onPress: () => {
                                    debug.consoleLogOverlayToggle()
                                }
                            },
                        ]}
                        row
                        itemProps={{
                            iconSize: 17,
                            buttonStyle: {
                                paddingHorizontal: 7
                            },
                        }}
                    />
                </View>
            </View>
        </TouchableWithoutFeedback>

        <View flex>

            {mode === 'scopes' ?
                <>
                    <TabBarStandalone
                        items={tabs.items}
                        activeIndex={tabs.activeIndex}
                        renderBadge={(scene: any) => {
                            const {route} = scene

                            const labels = Object
                                .keys(route.data.countByType)
                                .filter((eventType) => {
                                    const count = route.data.countByType[eventType]
                                    return !!count
                                })
                                .map((eventType) => {
                                    const count = route.data.countByType[eventType]
                                    const messageType = messageTypes[eventType]
                                    return <UiBadge
                                        key={eventType}
                                        label={count}
                                        backgroundColor={messageType.color}
                                        size={11}
                                        containerStyle={{
                                            paddingHorizontal: 0,
                                            top: -1
                                        }}
                                    />
                                })

                            return <View gap-1 row marginB-10>{labels}</View>
                        }}
                        onTabPress={(scene: any) => {
                            const routeKey = scene.route.key
                            tabs.changeValue(routeKey)
                        }}
                        scrollEnabled={true}
                        style={{
                            backgroundColor: COLORS.grey50,
                            elevation: 0,
                            overflow: 'visible'
                        }}
                        contentContainerStyle={{
                            marginHorizontal: 10,
                            overflow: 'visible'
                        }}
                        tabStyle={{
                            width: 'auto',
                            paddingTop: 9,
                            paddingBottom: 3,
                            paddingHorizontal: 5,
                            minHeight: 'auto',
                            flexDirection: 'row',
                            alignContent: 'center',
                            alignItems: 'center',
                            gap: 1
                        }}
                        labelStyle={{
                            marginVertical: 0,
                            marginHorizontal: 0,
                            paddingTop: 2,
                            //borderWidth: 1,
                            color: COLORS.grey20,
                            ...TYPOGRAPHY['text-xxs-m-lh0'],
                        }}
                        activeColor={COLORS.primary}
                        inactiveColor={COLORS.grey20}
                        indicatorStyle={{
                            backgroundColor: COLORS.primary
                        }}
                    />
                    <FlatList
                        ref={listRef}
                        data={itemsFiltered}
                        renderItem={renderItem}
                        keyExtractor={keyExtractor}
                        style={[
                            selectedItem ? {
                                height: '50%'
                            } : {
                                height: '100%'
                            }
                        ]}
                        contentContainerStyle={{
                            //paddingHorizontal: 10,
                            //paddingVertical: 10
                        }}
                        onViewableItemsChanged={onViewableItemsChanged}
                    />

                    {selectedItem && selectedItem.event.data && <View style={{}}>
                        <View absR absT marginR-10 marginT-10 style={{zIndex: 20}}>
                            <UiBtn
                                icon={icons.cancel}
                                backgroundColor={'#FFFFFF'}
                                color={COLORS.grey20}
                                iconSize={18}
                                onPress={() => {
                                    setSelectedItem(null)
                                }}
                            />
                        </View>
                        <Reanimated.ScrollView
                            style={animStyles}
                            contentContainerStyle={{
                                paddingVertical: 12,
                                backgroundColor: '#0E2A35'
                            }}
                        >
                            <View onLayout={onJsonLayout}>
                                <JSONTree
                                    data={selectedItem.event.data}
                                    hideRoot={false}
                                    getItemString={raw => <View><Text>{raw}</Text></View>}
                                    shouldExpandNode={(_keyName: any, _data: any, level: number) => {
                                        return level < 1
                                    }}
                                />
                            </View>
                        </Reanimated.ScrollView>
                    </View>}
                </>
                :
                <>
                    <TabBarStandalone
                        items={otherTabs.items}
                        activeIndex={otherTabs.activeIndex}
                        onTabPress={(scene: any) => {
                            const routeKey = scene.route.key
                            otherTabs.changeValue(routeKey)
                        }}
                        scrollEnabled={true}
                        style={{
                            backgroundColor: COLORS.grey50,
                            elevation: 0,
                            overflow: 'visible'
                        }}
                        contentContainerStyle={{
                            marginHorizontal: 10,
                            overflow: 'visible'
                        }}
                        tabStyle={{
                            width: 'auto',
                            paddingTop: 9,
                            paddingBottom: 3,
                            paddingHorizontal: 5,
                            minHeight: 'auto',
                            flexDirection: 'row',
                            alignContent: 'center',
                            alignItems: 'center',
                            gap: 1
                        }}
                        labelStyle={{
                            marginVertical: 0,
                            marginHorizontal: 0,
                            paddingTop: 2,
                            //borderWidth: 1,
                            color: COLORS.grey20,
                            ...TYPOGRAPHY['text-xxs-m-lh0'],
                        }}
                        activeColor={COLORS.primary}
                        inactiveColor={COLORS.grey20}
                        indicatorStyle={{
                            backgroundColor: COLORS.primary
                        }}
                    />

                    <>
                        <Switch>
                            <Case condition={otherTabs.activeValue === 'render'}>
                                <JSONTree
                                    data={debug.renderCounter}
                                    hideRoot={true}
                                />
                            </Case>
                            <Case condition={otherTabs.activeValue === 'second'}><Text>2222</Text></Case>
                        </Switch>
                    </>
                </>
            }

        </View>
    </View>
})

const styles = StyleSheet.create({
    shadow: {
        width: '100%',
        height: '100%',
        borderRadius: 12
    },
    box: {
        width: '100%',
        height: '100%',
        borderWidth: 1,
        borderColor: '#AAAAAA',
        borderRadius: 12,
        overflow: "hidden"
    },
    itemChannel: {
        backgroundColor: '#FFFFFF',
        borderRadius: 5,
        paddingVertical: 1,
        paddingHorizontal: 4
    },
    itemChannelText: {
        color: '#222222',
        ...TYPOGRAPHY['text-xxs-m-lh1'],
    },
    itemMessage: {
        ...TYPOGRAPHY['text-xs-m-lh1']
    },
    itemUnreadedMessage: {
        ...TYPOGRAPHY['text-xs-bo-lh1']
    },
    itemData: {
        ...TYPOGRAPHY['text-xs-r-lh1'],
        color: '#CCCCCC'
    },
    item: {
        borderBottomWidth: 1,
        borderColor: '#FFFFFF44',
        paddingVertical: 7,
        paddingHorizontal: 10,
        marginBottom: 0
    },
    itemSelected: {
        borderWidth: 2,
        borderBottomWidth: 2,
        borderColor: '#FFFFFF',
    },

});


const itemsStyle: Record<string, {
    rgb: string
}> = {
    info: {
        rgb: '44,82,93'
    },
    warning: {
        rgb: '190,149,82'
    },
    error: {
        rgb: '143,38,38'
    }
}

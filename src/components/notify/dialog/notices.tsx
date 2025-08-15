import React, {useCallback, useMemo, useState} from "react"
import {SectionList, StyleSheet} from "react-native"

import {observer} from "mobx-react"
import {useStores} from "~stores"
import {UiBottomSheet} from "~com//ui/bottom-sheet";
import {Checkbox, Text, View} from "react-native-ui-lib";
import {NoticeModel} from "@core/notice/model/Notice";
import timestampToFormat from "@core/main/util/date/timestampToFormat";
import {COLORS, TYPOGRAPHY} from "~assets/design";
import {useKeyExtractor} from "@core/main/lib/hooks/useKeyExtractor";
import {UiPressable} from "~ui/pressable";
import {UiSegmentProps} from "~ui/segments";
import {UiActions} from "~ui/actions";
import excludeEmptyFields from "@core/main/util/base/excludeEmptyFields";
import toArray from "@core/main/util/base/toArray"
import icons from "~assets/icons-map";
import {UiBtnProps} from "~ui/btn";

type TNoticesGroup = {
    title: string
    timestamp: number
    data: NoticeModel[]
}

const NoticeItem = observer(({item}: { item: NoticeModel }) => {

    const {noticeDialog, notice} = useStores()

    const onPress = useCallback((item: NoticeModel) => {
        noticeDialog.show({
            notice: item
        })
    }, [])

    const date = timestampToFormat(item.createdAt, 'time')


    const actions = useMemo(() => {
        const res: UiBtnProps[] = excludeEmptyFields(item.actionsMobile).filter(item => toArray(item.roles).includes('list'))
        if (item.haveBody) {
            res.push({
                label: 'подробнее',
                link: true,
                iconOnRight: true,
                icon: icons.angleRight,
                onPress: () => onPress(item)
            })
        }
        return res
    }, [onPress, item])

    const isNew = !item.getIsReaded()

    return <UiPressable
        onPress={() => onPress(item)}
        style={[
            styles.item,
            isNew && styles.itemNew
        ]}
    >
        <View row gap-8>
            <View flexS row gap-7>
                {isNew ?
                    <Text text-sm-bo>{item.title || item.message}</Text>
                    :
                    <Text text-sm-r>{item.title || item.message}</Text>
                }
            </View>
            <View marginL-auto row gap-7 top>
                {isNew ?
                    <View top bg-primary centerV paddingH-4 paddingV-1 style={{borderRadius: 6}}><Text text-xs-r
                                                                                                       white>{date}</Text></View>
                    :
                    <View><Text text-sm-r grey20>{date}</Text></View>
                }
            </View>
        </View>

        <UiActions
            items={actions}
            row
            gap-10
            right
            marginT-9
            itemProps={{
                link: true,
                color: COLORS.colorAspid,
                size: 'xSmall',
                iconSize: 15,
                buttonStyle: {},
            }}
        />
    </UiPressable>
})

export const NoticesDialog: React.FC = observer(() => {

    const {noticesDialog, noticeDialog, notice} = useStores()

    const [unreadedOnly, setUnreadedOnly] = useState<boolean>(false)

    const renderItem = useCallback(({item}: { item: NoticeModel }) => <NoticeItem item={item}/>, [])


    const renderHeader = useCallback(({section}: { section: TNoticesGroup }) => {
        return <View style={styles.header} row centerV>
            <Text style={styles.headerText}>{section.title}</Text>
        </View>
    }, [unreadedOnly, notice.unreadedNoticesCount])

    const keyExtractor = useKeyExtractor('ID')

    const [filter, setFilter] = useState('all')

    const filterOptions: UiSegmentProps[] = [
        {
            label: 'Все',
            value: 'all'
        },
        {
            label: 'Индивидуальные',
            value: 'individual'
        },
        {
            label: 'Общие',
            value: 'common'
        },
    ]

    const sections = useMemo(() => {
        return Object.values(
            notice.notices
                .filter((item) => {
                    if (unreadedOnly && item.getIsReaded())
                        return false
                    return filter === 'all' || item.targetCode === filter
                })
                .reduce<Record<any, TNoticesGroup>>((map, item) => {
                        const itemDate = timestampToFormat(item.createdAt, 'DD MMMM YYYY') as string
                        if (!map[itemDate]) {
                            map[itemDate] = {
                                title: itemDate,
                                timestamp: item.createdAt,
                                data: []
                            }
                        }
                        map[itemDate].data.push(item)
                        return map
                    },
                    {}
                )
        ).sort((a, b) => b.timestamp - a.timestamp)
    }, [notice.notices, filter, notice.readedIds, unreadedOnly])

    const onClose = useCallback(() => {
        notice.setNoticeShownAll()
        noticesDialog.hide()
    }, [])

    return <UiBottomSheet
        id={'notices'}
        isVisible={noticesDialog.visible}
        targetModifiers={{
            scroll: []
        }}
        preset={'default'}
        title={'Уведомления'}
        autoHeight={true}
        closeAction={true}
        onClose={onClose}
        bodyScrollable={false}
        noScrollView={true}
    >

        {
            /*
              <View marginT-14 marginB-8 paddingB-10 style={{
                    borderBottomWidth: 1,
                    borderColor: COLORS.grey50
                }}>
                 <UiSegments
                    segments={filterOptions}
                    activeColor={COLORS.primary}
                    activeBackgroundColor={COLORS.white}
                    value={filter}
                    onChangeValue={setFilter}
                    backgroundColor={COLORS.white}
                    outlineColor={COLORS.white}
                    segmentLabelStyle={{
                        ...TYPOGRAPHY['text-sm-m-lh0']
                    }}
                    style={{
                        borderWidth: 0
                    }}
                    segmentsStyle={{
                        paddingVertical: 0,
                    }}
                />
              </View>
             */
        }


        <View marginT-10 flex>

            {!!notice.unreadedNoticesCount && <View style={{position: 'absolute', right: 10, top: 3, zIndex: 100}}>
                <Checkbox
                    color={COLORS.primary}
                    value={unreadedOnly}
                    onValueChange={setUnreadedOnly}
                    label={'только непрочитанные'}
                    labelStyle={{
                        ...TYPOGRAPHY['text-xs-lh0']
                    }}
                    size={20}
                />
            </View>}

            <SectionList
                sections={sections}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                renderSectionHeader={renderHeader}
                contentContainerStyle={{
                    paddingHorizontal: 13,
                    paddingVertical: 0,
                    gap: 12
                }}
            />
        </View>

    </UiBottomSheet>
})

export default NoticesDialog

const styles = StyleSheet.create({
    itemNew: {
        //borderLeftWidth: 10,
        //borderColor: COLORS.secondaryDark
    },
    item: {
        backgroundColor: COLORS.grey70,
        padding: 15,
        borderRadius: 12,
    },
    header: {
        paddingVertical: 8,
        backgroundColor: COLORS.white,
    },
    headerText: {
        ...TYPOGRAPHY['text-xs-bo-lh0'],
        color: COLORS.grey20,
    },
})

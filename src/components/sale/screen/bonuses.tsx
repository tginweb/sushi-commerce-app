import React, {useMemo, useState} from "react"
import {StyleSheet} from "react-native"
import {observer} from "mobx-react"
import {useFocusEffect} from "expo-router"

import {useServices} from "~services"
import {useStores} from "~stores"
import {ProgressBar, Text, Timeline, TimelineProps, View} from "react-native-ui-lib"
import {TScreenProps} from "@core/main/types"
import {UiScreen} from "~ui/screen"
import {COLORS} from "~assets/design";
import {PointTypes} from "react-native-ui-lib/src/components/timeline/types";
import {BonusLevelElement} from "~gql/api";
import {UiBtn} from "~ui/btn";
import {UiView} from "~ui/view";

export const BonusesScreen: React.FC<TScreenProps> = observer(() => {


    const {sale, faqDialog} = useStores();
    const {bus, catalogUtil} = useServices();
    const [selectedLevelId, setSelectedLevelId] = useState<number>()

    const card = sale.userClientCard

    useFocusEffect(() => {
        //nav.setOptions({tabBarStyle: {display: 'none'}});
        bus.emitter.on('screen.reload', methods.reload)
        return () => {
            bus.emitter.off('screen.reload', methods.reload)
        }
    })

    const methods = {
        reload: async () => {
            await sale.fetchOrderProfiles()
        }
    }

    if (!card)
        return <></>

    const cardLevelIndex = sale.bonusLevels.findIndex(level => card.LEVEL && (level.ID === card.LEVEL.ID))

    const isMaxLevel = cardLevelIndex === sale.bonusLevels.length - 1

    const levels = useMemo(() => {

        let res: (BonusLevelElement & {
            REMAINS_TO_PAID?: number,
            PROGRESS?: number,
        })[] = []

        if (cardLevelIndex >= 0) {
            res = [...sale.bonusLevels].slice(cardLevelIndex + 1, sale.bonusLevels.length)
        } else {
            res = sale.bonusLevels
        }
        return res.map(level => {
            const clevel = {
                ...level,
            }
            if (card.MONTH_SPENT && level.MONTH_SPENT_MIN) {
                clevel.REMAINS_TO_PAID = level.MONTH_SPENT_MIN - card.MONTH_SPENT
                clevel.PROGRESS = 100 * card.MONTH_SPENT / level.MONTH_SPENT_MIN
            }
            return clevel
        })
    }, [])

    const renderCard = () => {

        if (!card.LEVEL)
            return <></>

        const fields = (() => {
            const res = [
                {
                    label: 'Можно оплатить',
                    value: 'до ' + card.LEVEL.MAX_USE_PERCENT + '%',
                },
                {
                    label: 'До сгорания бонусов',
                    value: card.bonusesExpireDuration,
                },
                {
                    label: 'Процент накопления',
                    value: card.LEVEL.ACCUMULATION_PERCENT + '%',
                },
            ]

            if (!isMaxLevel && card.MONTH_SPENT) {
                res.push({
                    label: 'Потрачено 6 месяцев',
                    value: catalogUtil.price(card.MONTH_SPENT, {splitSpaces: true}),
                })
            }
            return res
        })()

        return <UiView
            borderRadius={'md'}
            shadow
            fullWidth
            style={[
                styles.bonusCard,
                {
                    backgroundColor: card.LEVEL.COLOR
                }
            ]}
        >
            <View paddingH-15 paddingV-15 gap-10>

                <View row marginB-12 centerV>
                    <View flexG gap-10>
                        <Text text-xs-m-lh0 white>Ваш бонусный ранг</Text>
                        <Text text-lg-bo-lh0 white>{card.LEVEL.NAME}</Text>
                    </View>
                    <View>
                        <UiView border borderColor={"white"} borderRadius={'sm'} padding-10 center>
                            <Text text-lg-bo center white>{card.BONUSES}</Text>
                            <Text text-xs-bo center white>бонусов</Text>
                        </UiView>
                    </View>
                </View>

                {
                    fields.map(field => <View row key={field.label}>
                        <View flexG>
                            <View row>
                                <Text flex wrap text-md-m white>{field.label}</Text>
                            </View>
                        </View>
                        <View>
                            <Text text-md-bo white>{field.value}</Text>
                        </View>
                    </View>)
                }
            </View>
        </UiView>
    }

    const renderSuccess = () =>
        <View>
            <View style={{marginHorizontal: -10}}>
                {!isMaxLevel ?
                    <Timeline
                        point={{color: COLORS.primary, type: PointTypes.OUTLINE}}
                        bottomLine={{state: Timeline.states.SUCCESS, color: COLORS.primary}}
                    >
                        <View gap-14>
                            {renderCard()}
                            <Text center grey30>следующие ранги:</Text>
                        </View>
                    </Timeline>
                    :
                    <View marginH-screenH marginT-screenV>
                        <View gap-14>
                            {renderCard()}
                            <Text center>У вас максимальный бонусный ранг</Text>
                        </View>
                    </View>
                }

                {
                    levels.map((level, index) => {

                        const timelineProps: TimelineProps = {}

                        // last
                        if (index === levels.length - 1) {

                        } else {
                            timelineProps.bottomLine = {state: Timeline.states.SUCCESS, color: COLORS.primary}
                        }

                        return <Timeline
                            key={level.ID}
                            point={{
                                color: COLORS.primary,
                                type: PointTypes.CIRCLE
                            }}
                            topLine={{state: Timeline.states.SUCCESS, color: COLORS.primary}}
                            {...timelineProps}
                        >
                            <View marginV-3>
                                <UiView
                                    shadow={true}
                                    fullWidth={true}
                                    borderRadius={'md'}
                                    paddingV-15
                                    paddingH-13

                                    gap-8
                                    bg-white
                                    style={[styles.levelBox]}
                                >
                                    <View row marginB-7>

                                        <Text
                                            flexG
                                            text-lg-m-lh0
                                            style={{
                                                color: level.COLOR
                                            }}
                                        >
                                            {level.NAME}
                                        </Text>
                                        <View centerV row gap-5>
                                            <Text text-xs-lh0>накопления</Text>
                                            <Text
                                                text-md-bo-lh0
                                                color={level.COLOR}
                                            >
                                                {level.ACCUMULATION_PERCENT}%
                                            </Text>
                                        </View>
                                    </View>

                                    <View gap-13>

                                        {
                                            level.REMAINS_TO_PAID && <View row centerV gap-15>
                                                <Text>
                                                    Осталось потратить:
                                                </Text>
                                                <View gap-5>
                                                    <Text
                                                        primary
                                                    >
                                                        {catalogUtil.price(level.REMAINS_TO_PAID, {splitSpaces: true})}
                                                    </Text>
                                                    <ProgressBar
                                                        progress={level.PROGRESS}
                                                        progressColor={COLORS.primaryLighter}
                                                        style={{height: 4}}
                                                    />
                                                </View>
                                            </View>
                                        }

                                        <View row centerV gap-5>
                                            <Text
                                                numberOfLines={1}
                                                ellipsizeMode={'clip'}
                                                text-xs
                                                wrap
                                            >
                                                Сумма заказов 6 мес:
                                            </Text>
                                            <Text
                                                text-sm-m
                                                marginL-auto
                                            >{level.ORDERS_SUMM}</Text>
                                        </View>

                                        <View row gap-15>
                                            <Text
                                                numberOfLines={2}
                                                flex
                                                text-xs
                                                wrap
                                            >
                                                Можно оплатить от суммы заказа:
                                            </Text>
                                            <Text
                                                text-sm-m
                                                marginL-auto
                                            >до {level.MAX_USE_PERCENT}%</Text>
                                        </View>

                                    </View>
                                </UiView>
                            </View>
                        </Timeline>
                    })
                }
            </View>
            <View marginH-screenH marginV-20 gap-10>
                <UiBtn
                    backgroundColor={COLORS.white}
                    color={COLORS.primary}
                    label={'Подробнее о бонусах'}
                    action={{
                        url: 'router://info/page?code=/bonuses-info',
                        addBacklink: true
                    }}
                />
                <UiBtn
                    backgroundColor={COLORS.white}
                    color={COLORS.primary}
                    label={'Вопросы и ответы'}
                    onPress={() => {
                        faqDialog.show({
                            openElement: 'bonus_lost'
                        })
                    }}
                />
            </View>
        </View>

    const renderNotFetched = () => <View flex centerV padding-30 gap-20>
        <Text center>Информация о ваших бонусах не загружена</Text>
        <UiBtn
            label={'Повторить загрузку'}
            onPress={sale.fetchClientCard}
            loading={sale.fetchClientCard.pending}
        />
    </View>


    return (
        <UiScreen
            preset={'default'}
            //backgroundColor={COLORS.white}
            modifiers={{
                body: []
            }}
            loading={sale.fetchClientCard.pending}
            loadingTitle={'Загрузка данных о бонусах'}
        >

            {card.LEVEL ? renderSuccess() : renderNotFetched()}

        </UiScreen>
    )
});


const styles = StyleSheet.create({
    levelBox: {},
    bonusCard: {
        position: 'relative',
        justifyContent: 'space-between',
        backfaceVisibility: 'hidden',
    },
});

export default BonusesScreen

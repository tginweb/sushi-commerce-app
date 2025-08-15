import React, {useEffect, useMemo, useRef, useState} from "react"
import {StyleSheet} from "react-native"

import {observer} from "mobx-react"
import {useStores} from "~stores"
import {UiBottomSheet} from "~com//ui/bottom-sheet";
import {COLORS, TYPOGRAPHY, wWidth} from "~assets/design";
import {ExpandableSection, Text, View} from "react-native-ui-lib";
import RenderHtml from "react-native-render-html";
import {TabBarStandalone} from "~ui/tab-view/TabBarStandalone";
import {TTabControllerItemProps, useTabs} from "~ui/tabs";
import {TDebugEventScope} from "@core/main/types";
import {FaqElement} from "~gql/api";
import icons from "~assets/icons-map";
import {UiActions} from "~ui/actions";

export const FaqDialog: React.FC = observer(() => {

    const {faqDialog, faq} = useStores()

    const mounted = useRef(false)

    const initialElement = useMemo(() => {
        let elementIdOrCode = faqDialog.props.openElement
        if (elementIdOrCode) {
            if (typeof elementIdOrCode === 'string') {
                return faq.elements.find(item => item.CODE === elementIdOrCode)
            } else if (typeof elementIdOrCode === 'number') {
                return faq.elements.find(item => item.ID === elementIdOrCode)
            }
        }
    }, [faqDialog.props.openElement])

    const initialSection = useMemo(() => {
        let sectionIdOrCode = initialElement ? initialElement.IBLOCK_SECTION_ID : faqDialog.props.openSection
        if (typeof sectionIdOrCode === 'string') {
            return faq.sections.find(section => section.CODE === sectionIdOrCode)
        } else if (typeof sectionIdOrCode === 'number') {
            return faq.sections.find(section => section.ID === sectionIdOrCode)
        }
    }, [faqDialog.props.openSection, initialElement])

    const [expanded, setExpanded] = useState<Record<any, boolean>>({})

    const setItemExpanded = (element: FaqElement, state?: boolean, closeOthers = false) => {
        setExpanded({
            ...(!closeOthers ? expanded : {}),
            [element.ID]: typeof state !== 'undefined' ? state : !expanded[element.ID]
        })
    }

    const getHeaderElement = (element: FaqElement) => {

        const textProps: any = {}

        const isExpanded = expanded[element.ID]

        if (isExpanded) {
            textProps.primary = true
            //iconProps.style.transform = [{rotate: '180deg'}]
        } else {
            textProps.colorAspid = true
        }

        return <View row>
            <Text {...textProps} text-md-m style={{width: '90%'}}>
                {element.NAME}
            </Text>
            <View marginT-5 marginL-auto>
                {
                    isExpanded ?
                        icons.angleDown({
                            size: 18,
                            color: COLORS.primary
                        })
                        :
                        icons.angleRight({
                            size: 18,
                            color: COLORS.primary
                        })
                }
            </View>
        </View>
    }


    const tabs = useTabs<TDebugEventScope>({
        value: initialSection ? initialSection.ID : 0,
        items: useMemo(() => {
            let res: TTabControllerItemProps[] = []
            res = faq.sections.map((section) => {
                return {
                    label: section.NAME,
                    value: section.ID,
                } as TTabControllerItemProps
            })
            res.unshift({
                label: 'Все',
                value: 0
            } as TTabControllerItemProps)
            return res
        }, [faq.sections]),
    })

    const items = useMemo(() => {
        if (!tabs.activeValue) {
            return faq.elements
        } else {
            return faq.elementsBySection[tabs.activeValue]
        }
    }, [tabs.activeValue])

    useEffect(() => {

        if (!tabs.activeValue) {
            setExpanded({})
        } else {
            if (items.length) {
                if (!mounted.current && initialElement) {
                    setItemExpanded(initialElement, true, true)
                } else {
                    setItemExpanded(items[0], true, true)
                }
            }
        }
        mounted.current = true
    }, [tabs.activeValue]);

    const expandAll = () => {
        setExpanded(items.reduce<Record<any, boolean>>((map, item) => {
            map[item.ID] = true
            return map
        }, {}))
    }

    const collapseAll = () => {
        setExpanded({})
    }

    return <UiBottomSheet
        id={'faq'}
        isVisible={faqDialog.visible}
        targetModifiers={{
            scroll: []
        }}
        preset={'default'}
        title={'Вопросы и ответы'}
        autoHeight={false}
        snapPoints={['100%']}
        closeAction={true}
        onClose={() => faqDialog.hide(true)}
        enableContentPanningGesture={false}
    >
        <TabBarStandalone
            items={tabs.items}
            activeIndex={tabs.activeIndex}
            onIndexChange={(index) => {
                tabs.changeIndex(index)
            }}
            scrollEnabled={true}
            style={{
                backgroundColor: COLORS.white,
                elevation: 0,
                marginLeft: 20,
                marginTop: 10
            }}
            tabStyle={{
                width: 'auto',
                paddingVertical: 8,
                paddingHorizontal: 6,
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
                ...TYPOGRAPHY['text-xs-m-lh0'],
            }}
            //renderTabBarItem={}
            activeColor={COLORS.primary}
            inactiveColor={COLORS.grey20}
            indicatorStyle={{
                backgroundColor: COLORS.primary
            }}
        />

        <View style={{gap: 10, minHeight: 200}} marginV-modalV marginH-modalH>
            {items.map((item, index) => {
                return <View
                    key={item.ID}
                    style={{backgroundColor: COLORS._white}}
                    paddingH-14
                    paddingV-12
                    br-md
                >
                    <ExpandableSection
                        expanded={expanded[item.ID]}
                        sectionHeader={getHeaderElement(item)}
                        onPress={() => setItemExpanded(item)}
                    >
                        <View marginT-10>
                            <RenderHtml
                                contentWidth={wWidth}
                                source={{html: '<div style="font-size:18px;font-weight: 300;font-family: tahoma;">' + item.DETAIL_TEXT + '</div>'}}
                            />
                            {!!item.ACTIONS_MOBILE && !!item.ACTIONS_MOBILE.length && <UiActions
                                marginT-10
                                row
                                gap-10
                                items={item.ACTIONS_MOBILE}
                                itemProps={{
                                    size: 'small',
                                    'text-xs-lh0': true,
                                    outline: true,
                                    color: COLORS.primary
                                }}
                            />}
                        </View>
                    </ExpandableSection>
                </View>
            })}
        </View>

    </UiBottomSheet>
})

export default FaqDialog

const styles = StyleSheet.create({})

import React, {useState} from "react"
import {Dimensions, StyleSheet} from "react-native"
import {observer} from "mobx-react"
import {useServices} from "~services"
import {useStores} from "~stores"
import {ExpandableSection, Text, View} from "react-native-ui-lib"
import {TScreenProps} from "@core/main/types"
import RenderHtml from "react-native-render-html"
import {UiScreen} from "~ui/screen"
import {COLORS} from "~assets/design";

export const FaqScreen: React.FC<TScreenProps> = observer(() => {

    const {faq} = useStores();
    const {} = useServices()

    const [expanded, setExpanded]: any = useState({})

    const onExpand = (element: any) => {
        setExpanded({...expanded, [element.ID]: !expanded[element.ID]})
    }

    const getHeaderElement = (element: any) => {

        const textProps: any = {}
        const iconProps: any = {
            style: {}
        }

        if (expanded[element.ID]) {
            textProps.primary = true
            iconProps.color = COLORS.primary
            iconProps.style.transform = [{rotate: '180deg'}]
        } else {
            textProps.grey10 = true
            iconProps.color = '#111'
        }

        return <View spread row centerV>
            <Text {...textProps} text-md-m style={{width: '90%'}}>
                {element.NAME}
            </Text>
            <Text>

            </Text>
        </View>
    }

    const width = Dimensions.get('window').width;

    return (
        <UiScreen preset={'default'}>

            <View style={{gap: 10}}>
                {faq.elements.map((element: any, index: number) => {
                    return <View
                        key={element.ID}
                        style={{backgroundColor: COLORS._white}}
                        paddingH-14
                        paddingV-12
                        br-md
                    >
                        <ExpandableSection
                            expanded={!!expanded[element.ID]}
                            sectionHeader={getHeaderElement(element)}
                            onPress={() => onExpand(element)}
                        >
                            <View marginT-10>
                                <RenderHtml
                                    contentWidth={width}
                                    source={{html: '<div style="font-size:18px;font-weight: 300;font-family: tahoma;">' + element.DETAIL_TEXT + '</div>'}}
                                />
                            </View>
                        </ExpandableSection>
                    </View>
                })}
            </View>
        </UiScreen>
    )
})

const styles = StyleSheet.create({

    bonusCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        overflow: "hidden",
        shadowColor: '#000',
        shadowOffset: {
            width: 2,
            height: 4,
        },
        shadowOpacity: 0.34,
        shadowRadius: 10,
        justifyContent: 'space-between',
        backfaceVisibility: 'hidden',
        elevation: 2,
    },
});

export default FaqScreen

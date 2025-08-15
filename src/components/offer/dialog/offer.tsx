import React, {useMemo} from "react"
import {StyleSheet} from "react-native"
import {Text, View} from "react-native-ui-lib"
import {COLORS, wWidth} from "~assets/design"
import HTML from "react-native-render-html"

import {UiBottomSheet, UiBottomSheetMethods} from "~com/ui/bottom-sheet";
import {observer} from "mobx-react";
import {useStores} from "~stores";
import {useServices} from "~services";
import {UiImage} from "~ui/image";
import {UiBtn, UiBtnProps} from "~ui/btn";
import icons from "~assets/icons-map";
import {OfferModel} from "@core/offer/model/Offer";
import excludeEmptyFields from "@core/main/util/base/excludeEmptyFields";
import OfferConfig from "@core/offer/config";
import AppConfig from "@core/main/config";

export const OfferModal: React.FC = observer(({}) => {

    const {menu, offer, page} = useStores()
    const {imager, html} = useServices()

    const element = offer.dialog.props.element || new OfferModel({})

    const currentPage = page.getPageByPath(OfferConfig.OFFER_VIEW_DIALOG_URL)
    const pageChunks = currentPage?.chunk || {}

    const pageOptions = {
        showCloseAction: true,
        ...(pageChunks.options || {}),
    }

    const refs = {
        sheet: React.useRef<UiBottomSheetMethods>(null as any),
    }

    const source = {html: element.detailTextHtml}

    const footerActions = useMemo(() => {
        const res: UiBtnProps[] = []
        if (element.ACTIONS_MOBILE.length) {
            Array.prototype.push.apply(res, excludeEmptyFields(element.ACTIONS_MOBILE))
        }
        if (!res.length && pageOptions.showCloseAction)
            res.push({
                label: 'Закрыть',
                outline: true,
                color: COLORS.primary,
                onPress: () => {
                    offer.dialog.hide()
                }
            })
        return res
    }, [element.ID])

    const currentIndex = offer.allOffers.indexOf(element)
    const havePrev = !!offer.allOffers[currentIndex - 1]
    const haveNext = !!offer.allOffers[currentIndex + 1]

    const onPrevious = () => {
        const index = offer.allOffers.indexOf(element)
        const prevElement = offer.allOffers[index - 1]
        if (prevElement)
            offer.dialog.addProps({
                element: prevElement
            })
    }

    const onNext = () => {
        const index = offer.allOffers.indexOf(element)
        const nextElement = offer.allOffers[index + 1]
        if (nextElement)
            offer.dialog.addProps({
                element: nextElement
            })
    }

    const actionProps = useMemo<UiBtnProps>(() => {
        return {
            onPress: () => {
                offer.dialog.hide()
            }
        }
    }, [])


    return <UiBottomSheet
        id={'offer'}
        ref={refs.sheet}
        isVisible={offer.dialog.visible}
        footerActions={footerActions}
        footerActionProps={actionProps}
        onClose={() => {
            console.log('ON CLOSE')
            offer.dialog.hide()
        }}
        targetModifiers={{
            scroll: [],
        }}
        preset={'default'}
        topbarHide={true}
        closerPosition={'outsideRight'}
    >

        <View style={{position: 'relative'}}>
            {
                !!element.BANNER_SQUARE?.SRC &&
                <UiImage
                    key={element.ID}
                    source={{
                        uri: imager.resolve(element.BANNER_SQUARE?.SRC, 'w-1')
                    }}
                    aspectRatio={1}
                />
            }
            <View
                row
                style={{
                    position: 'absolute',
                    top: '50%',
                    transform: [{translateY: -25}],
                    width: '100%',
                    paddingHorizontal: 8
                } as any}
            >
                <View>
                    {havePrev && <UiBtn
                        row={true}
                        iconSize={33}
                        link
                        iconColor={COLORS.white}
                        enableShadow={true}
                        icon={icons.angleLeft}
                        onPress={onPrevious}
                        buttonStyle={{
                            paddingVertical: 20,
                            paddingHorizontal: 25,
                            // borderWidth: 1
                        }}
                        iconStyle={{
                            marginLeft: -20
                        }}
                    />}
                </View>
                <View marginL-auto>
                    {haveNext && <UiBtn
                        row={true}
                        iconSize={33}
                        link
                        iconColor={COLORS.white}
                        enableShadow={true}
                        icon={icons.angleRight}
                        onPress={onNext}
                        buttonStyle={{
                            paddingVertical: 20,
                            paddingHorizontal: 25,
                            //borderWidth: 1
                        }}
                        iconStyle={{
                            marginRight: -20
                        }}
                    />}
                </View>
            </View>
        </View>

        <View paddingH-modalH paddingV-modalV>
            <Text text-xl-m marginB-modalV>{element.NAME_TEMPLATED}</Text>
            <HTML
                classesStyles={html.getClassesStyles()}
                tagsStyles={html.getTagsStyles()}
                source={source}
                contentWidth={wWidth - 32}
            />
        </View>
    </UiBottomSheet>
})

export default OfferModal

const styles = StyleSheet.create({});

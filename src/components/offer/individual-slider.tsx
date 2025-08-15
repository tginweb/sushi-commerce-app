import React, {useEffect, useState} from "react"
import {ScrollView, StyleSheet} from "react-native"
import {Text, TouchableOpacity, View, ViewProps} from "react-native-ui-lib"
import {useServices} from "~services"
import {OfferModel} from "@core/offer/model/Offer";
import {COLORS, roundStyle, wWidth} from "~assets/design";
import {UiImage} from "~ui/image";
import Loader from "~ui/stories/components/Loader";
import {useSharedValue} from "react-native-reanimated";
import {Shadow} from "react-native-shadow-2";
import {useStores} from "~stores";

export type OffersIndividualSliderProps = ViewProps & {
    offers: OfferModel[],
    excludeIds?: number[]
}

export const OffersIndividualSlider: React.FC<OffersIndividualSliderProps> = (
    {
        offers,
        excludeIds,
        ...rest
    }
) => {
    const {imager} = useServices()
    const {offer: offerStore} = useStores()

    const loading = useSharedValue<boolean>(true)
    const [loadingState, setLoadingState] = useState(true)

    const colors = useSharedValue<string[]>(['#F7B801', '#F18701', '#F35B04', '#F5301E', '#C81D4E', '#8F1D4E'])

    useEffect(() => {

        setTimeout(() => {
            loading.value = false
            setLoadingState(false)
        }, 3000)
    }, [])

    //name: offer.NAME_TEMPLATED,
    //imager.resolve(offer.BANNER_SQUARE?.SRC, 'w-1-3') || '',
    return <View row {...rest}>
        <ScrollView
            horizontal
            style={{
                overflow: 'visible'
            }}
            contentContainerStyle={{
                gap: 10,
                justifyContent: 'center',
                flex: 1,
                overflow: 'visible'
            }}
        >
            {offers.map((offer) => {


                    return <TouchableOpacity
                        key={offer.ID}
                        onPress={() => {
                            offerStore.openOffer(offer)
                        }}
                    >
                        <View style={styles.item} gap-6 centerH>
                            <View>
                                {loadingState && <Loader
                                    loading={loading}
                                    color={colors}
                                    size={68}
                                    style={{
                                        position: 'absolute',
                                        left: -4,
                                        top: -4,
                                        right: 0,
                                        zIndex: 100
                                    }}
                                />}

                                <Shadow distance={loadingState ? 0 : 4} startColor={COLORS.primary + '40'}
                                        endColor={COLORS.primary + '01'}>
                                    <UiImage
                                        style={[
                                            styles.image,
                                            !loadingState && styles.imageLoaded,
                                        ]}
                                        source={{
                                            uri: imager.resolve(offer.BANNER_SQUARE?.SRC, 'w-1-3')
                                        }}
                                        contentFit={'contain'}
                                        vendor={'expo'}
                                        aspectRatio={1}
                                    />
                                </Shadow>
                            </View>

                            <Text text-xs-m-lh1 center>{offer.NAME_TEMPLATED}</Text>
                        </View>
                    </TouchableOpacity>
                }
            )}

        </ScrollView>
    </View>
}

const styles = StyleSheet.create({
    item: {
        //borderWidth: 1,
        width: (wWidth - (16 + 12) * 2) / 2.5,
    },
    image: {
        ...roundStyle(60),
    },
    imageLoaded: {}
})


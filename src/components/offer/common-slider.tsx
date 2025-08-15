import React, {useCallback, useRef} from "react"
import {Carousel, TouchableOpacity} from "react-native-ui-lib"
import {useServices} from "~services"
import {UiImage} from "~ui/image"
import {StyleSheet} from "react-native"
import {useStores} from "~stores";
import {OfferModel} from "@core/offer/model/Offer";

export type OffersCommonSliderProps = {
    items: OfferModel[],
    onSelect?: (element: OfferModel) => void
}

export const OffersCommonSlider: React.FC<OffersCommonSliderProps> = (
    {
        items,
        onSelect
    }
) => {
    const {imager, bus} = useServices()
    const {offer} = useStores()

    const onOpen = useCallback((item: OfferModel) => {
        offer.openOffer(item, 'sheet')
    }, [])

    const ref = useRef<typeof Carousel>()

    return <Carousel
        ref={ref}
        containerStyle={{}}
        onChangePage={(newIndex) => {
            if (items.length === newIndex + 1) {
                setTimeout(() => {
                    ref.current?.goToPage(0, true);
                }, 3000)
            }
        }}
        pageWidth={300}
        pagingEnabled={true}
        itemSpacings={10}
        showCounter={true}
        containerMarginHorizontal={6}
        autoplay={true}
        autoplayInterval={2500}
    >
        {items.map((element, index) => {
            const imageSrc = element.BANNER_HOR_MOBILE?.SRC
            if (!imageSrc)
                return <></>;
            return <TouchableOpacity
                key={element.ID}
                style={styles.slide}
                onPress={() => onOpen(element)}
            >
                <UiImage
                    source={{uri: imager.resolve(imageSrc)}}
                    vendor={'expo'}
                    resizeMode={'contain'}
                    style={styles.image}
                    //autoHeight={true}
                    aspectRatio={2.2}
                />
            </TouchableOpacity>
        })}

    </Carousel>
}

const styles = StyleSheet.create({
    slide: {
        overflow: 'hidden',
        borderRadius: 20,
        flex: 1,
    },
    image: {
        width: '100%',
        height: undefined,
    }
});

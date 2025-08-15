import React, {useMemo} from "react"
import {Carousel, TouchableOpacity} from "react-native-ui-lib"
import {useServices} from "~services"
import {UiImage} from "~ui/image"
import {ElementModel} from "@core/main/model/Element"
import {StyleSheet} from "react-native"

export type PromoSliderProps = {
    items: ElementModel[],
    onSelect?: (element: ElementModel) => void
}

export const PromoSlider: React.FC<PromoSliderProps> = (
    {
        items,
        onSelect
    }
) => {
    const {imager} = useServices()

    return useMemo(() => <Carousel
        containerStyle={{}}
        onChangePage={() => console.log('page changed')}
        pageWidth={300}
        pagingEnabled={true}
        itemSpacings={10}
        showCounter={true}
        containerMarginHorizontal={6}
        autoplay={true}
        autoplayInterval={3000}
    >
        {items.slice(1).map((element, index) => {
            const imageSrc = element.prop.INDEX_PAGE_PIC_MOBILE?.FILE?.SRC

            if (!imageSrc)
                return <></>;

            return <TouchableOpacity
                key={index}
                style={styles.slide}
                onPress={() => onSelect && onSelect(element)}
            >
                <UiImage
                    source={{uri: imager.resolve(imageSrc)}}
                    vendor={'expo'}
                    resizeMode={'contain'}
                    style={styles.image}
                    autoHeight={true}
                    aspectRatio={2.2}
                />
            </TouchableOpacity>
        })}

    </Carousel>, [items])
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

import React from "react"
import {Carousel, TouchableOpacity} from "react-native-ui-lib"
import {useServices} from "~services"
import {UiImage} from "~ui/image"
import {ElementModel} from "@core/main/model/Element"
import {StyleSheet} from "react-native"
import {wWidth} from "~assets/design"

type TProps = {
    items: ElementModel[],
    onSelect?: (element: ElementModel) => void
}

export const PromoSlider: React.FC<TProps> = (
    {
        items,
        onSelect
    }
) => {
    const {imager} = useServices()


    return <Carousel
        containerStyle={{}}
        onChangePage={() => console.log('page changed')}
        pageWidth={wWidth - 70}
    >

        {items.slice(1).map(element => {
            const imageSrc = element.prop.INDEX_PAGE_PIC_MOBILE?.FILE?.SRC

            if (!imageSrc)
                return <></>;

            return <TouchableOpacity
                key={element.ID}
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
